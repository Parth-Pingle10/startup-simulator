from fastapi import (
    APIRouter,
    HTTPException,
    Depends
)

import traceback

from backend.auth.schemas import (
    Register,
    Login,
    RefreshTokenResquest,
    OtpRequest,
    OtpVerify,
)

from backend.auth.service import (
    register_user,
    login_user,
    refresh_access_token,
    logout_user,
    request_otp_login,
    verify_otp_login,
)

from backend.auth.dependencies import (
    get_current_user
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register")
async def register(request: Register):
    try:
        return await register_user(request)
    except Exception as e:
        traceback.print_exc()  
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


@router.post("/login")
async def login(
    request: Login
):

    try:

        return await login_user(
            request
        )

    except Exception as e:

        raise HTTPException(
            status_code=401,
            detail=str(e)
        )


@router.post("/otp/request")
async def otp_request(request: OtpRequest):
    try:
        return await request_otp_login(request.email)
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/otp/verify")
async def otp_verify(request: OtpVerify):
    try:
        return await verify_otp_login(request.email, request.code, request.name)
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))


@router.post("/refresh")
async def refresh(
    request: RefreshTokenResquest
):

    try:

        return await refresh_access_token(
            request.user_id,
            request.refresh_token
        )

    except Exception as e:

        raise HTTPException(
            status_code=401,
            detail=str(e)
        )


@router.post("/logout")
async def logout(
    request: RefreshTokenResquest
):

    try:

        return await logout_user(
            request.user_id,
            request.refresh_token
        )

    except Exception as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


@router.get("/me")
async def me(

    current_user=Depends(
        get_current_user
    )

):

    return current_user
