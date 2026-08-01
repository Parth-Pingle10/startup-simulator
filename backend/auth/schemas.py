from pydantic import BaseModel,EmailStr,Field

class Register(BaseModel):
    
    name : str = Field(
        min_length= 2,
        max_length=50
    )
    
    email : EmailStr 
    
    password : str = Field(
        min_length = 8,
        max_length = 64
    )

class Login(BaseModel):
    
    email : EmailStr
    
    password : str


class OtpRequest(BaseModel):
    email: EmailStr


class OtpVerify(BaseModel):
    email: EmailStr
    code: str = Field(min_length=4, max_length=10)
    name: str | None = Field(default=None, max_length=50)
    
class TokenResponse(BaseModel):
    
    access_token : str
    
    refresh_token : str
    
    token_type : str = "bearer"
    
class RefreshTokenResquest(BaseModel):
    
    user_id: str
    
    refresh_token : str
