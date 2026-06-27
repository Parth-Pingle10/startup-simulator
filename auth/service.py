import uuid

from datetime import (
    datetime,
    timezone
)

from database.collections import (
    users_collection,
    refresh_tokens_collection
)

from auth.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    hash_refresh_token,
    verify_refresh_token
)


async def register_user(request):

    existing_user = await users_collection.find_one(
        {
            "email": request.email
        }
    )

    if existing_user:

        raise Exception(
            "Email already registered."
        )

    user = {

        "user_id":
        str(uuid.uuid4()),

        "name":
        request.name,

        "email":
        request.email,

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

    if not verify_password(
        request.password,
        user["password"]
    ):

        raise Exception(
            "Invalid email or password."
        )

    access_token = create_access_token(
        user["user_id"],
        user["email"]
    )

    refresh_token, expires_at = (
        create_refresh_token()
    )
    
    hashed_refresh_tokens = hash_refresh_token(refresh_token)

    await refresh_tokens_collection.delete_many(
        {
            "user_id":
            user["user_id"]
        }
    )

    await refresh_tokens_collection.insert_one(

        {

            "user_id":
            user["user_id"],

            "refresh_token":
            hashed_refresh_tokens,

            "expires_at":
            expires_at,

            "created_at":
            datetime.now(
                timezone.utc
            )
        }

    )

    return {

        "access_token":
        access_token,

        "refresh_token":
        refresh_token,

        "token_type":
        "Bearer"
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

    access_token = create_access_token(
        user["user_id"],
        user["email"]
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

    return {
        "access_token": access_token,
        "refresh_token": new_refresh_token,
        "token_type": "Bearer"
    }


async def logout_user(
    refresh_token: str
):

    await refresh_tokens_collection.delete_one(

        {

            "refresh_token":
            refresh_token

        }

    )

    return {

        "message":
        "Logged out successfully."

    }