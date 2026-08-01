import uuid

from datetime import (
    datetime,
    timedelta,
    timezone,
)

from backend.database.collections import (
    users_collection,
    refresh_tokens_collection,
    email_verifications_collection,
)

from backend.auth.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    hash_refresh_token,
    verify_refresh_token
)

from backend.auth.twilio_otp import send_email_otp, verify_email_otp


async def _mark_email_verified(email: str) -> None:
    email = email.strip().lower()
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)

    await email_verifications_collection.delete_many({"email": email})
    await email_verifications_collection.insert_one(
        {
            "email": email,
            "verified_at": datetime.now(timezone.utc),
            "expires_at": expires_at,
            "used": False,
        }
    )


async def _consume_verified_email(email: str) -> bool:
    email = email.strip().lower()
    doc = await email_verifications_collection.find_one({"email": email, "used": False})
    if not doc:
        return False

    expires_at = doc.get("expires_at")
    if expires_at and expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)

    if not expires_at or expires_at < datetime.now(timezone.utc):
        await email_verifications_collection.delete_many({"email": email})
        return False

    await email_verifications_collection.update_one(
        {"_id": doc["_id"]},
        {"$set": {"used": True}},
    )
    return True


async def _issue_tokens(user: dict):
    access_token = create_access_token(
        user["user_id"],
        user["email"]
    )

    refresh_token, expires_at = create_refresh_token()
    hashed_refresh_tokens = hash_refresh_token(refresh_token)

    await refresh_tokens_collection.delete_many(
        {
            "user_id": user["user_id"]
        }
    )

    await refresh_tokens_collection.insert_one(
        {
            "user_id": user["user_id"],
            "refresh_token": hashed_refresh_tokens,
            "expires_at": expires_at,
            "created_at": datetime.now(timezone.utc)
        }
    )

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "Bearer"
    }


async def register_user(request):

    email = str(request.email).strip().lower()

    existing_user = await users_collection.find_one(
        {
            "email": email
        }
    )

    if existing_user:

        raise Exception(
            "Email already registered."
        )

    if not await _consume_verified_email(email):
        raise Exception(
            "Please verify your email first."
        )

    user = {

        "user_id":
        str(uuid.uuid4()),

        "name":
        request.name,

        "email":
        email,

        "password":
        hash_password(
            request.password
        ),

        "created_at":
        datetime.now(
            timezone.utc
        )
    }
    
    await users_collection.insert_one(
        user
    )

    return {
        "message":
        "Registration successful."
    }
    


async def login_user(request):

    user = await users_collection.find_one(
        {
            "email":
            request.email
        }
    )

    if not user:

        raise Exception(
            "Invalid email or password."
        )

    if not user.get("password") or not verify_password(
        request.password,
        user["password"]
    ):

        raise Exception(
            "Invalid email or password."
        )

    return await _issue_tokens(user)


async def request_otp_login(email: str):
    email = email.strip().lower()
    return await send_email_otp(email)


async def verify_otp_login(email: str, code: str, name: str | None = None):
    email = email.strip().lower()
    ok = await verify_email_otp(email, code)
    if not ok:
        raise Exception("Invalid or expired OTP.")

    await _mark_email_verified(email)

    return {
        "message": "OTP verified successfully.",
        "status": "verified"
    }


async def refresh_access_token(
    user_id: str,
    refresh_token: str
):

    session = await refresh_tokens_collection.find_one(
        {
            "user_id": user_id
        }
    )

    if session is None:

        raise Exception(
            "Invalid refresh token."
        )

    if not verify_refresh_token(
        refresh_token,
        session["refresh_token"]
    ):

        raise Exception(
            "Invalid refresh token."
        )
    expires_at = session["expires_at"]

    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
        
    if expires_at < datetime.now(timezone.utc):
        
        await refresh_tokens_collection.delete_one(
            {
                "_id": session["_id"]
            }
        )

        raise Exception(
            "Refresh token expired."
        )

    user = await users_collection.find_one(
        {
            "user_id": user_id
        }
    )

    new_refresh_token, expires_at = (
        create_refresh_token()
    )

    hashed_refresh_token = hash_refresh_token(
        new_refresh_token
    )

    await refresh_tokens_collection.update_one(
        {
            "_id": session["_id"]
        },
        {
            "$set": {
                "refresh_token": hashed_refresh_token,
                "expires_at": expires_at,
                "created_at": datetime.now(
                    timezone.utc
                )
            }
        }
    )

    access_token = create_access_token(
        user["user_id"],
        user["email"]
    )

    return {
        "access_token": access_token,
        "refresh_token": new_refresh_token,
        "token_type": "Bearer"
    }


async def logout_user(
    user_id: str,
    refresh_token: str
):

    session = await refresh_tokens_collection.find_one(
        {
            "user_id": user_id
        }
    )

    if session and verify_refresh_token(refresh_token, session["refresh_token"]):
        await refresh_tokens_collection.delete_one(
            {
                "_id": session["_id"]
            }
        )

    return {

        "message":
        "Logged out successfully."

    }
