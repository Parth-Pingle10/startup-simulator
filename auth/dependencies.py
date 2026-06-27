from fastapi import (
    Depends,
    HTTPException,
    status
)

from fastapi.security import (
    OAuth2PasswordBearer
)

from auth.security import (
    verify_token
)

from database.collections import (
    users_collection
)

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login"
)


async def get_current_user(

    token: str = Depends(
        oauth2_scheme
    )

):

    payload = verify_token(
        token
    )

    if payload is None:

        raise HTTPException(

            status_code=status.HTTP_401_UNAUTHORIZED,

            detail="Invalid or expired access token."

        )

    user = await users_collection.find_one(

        {

            "user_id":
            payload["user_id"]

        }

    )

    if user is None:

        raise HTTPException(

            status_code=status.HTTP_404_NOT_FOUND,

            detail="User not found."

        )

    user.pop(
        "password",
        None
    )
    user.pop("_id", None)

    return user