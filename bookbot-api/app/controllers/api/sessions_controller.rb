class Api::SessionsController < ApplicationController
  skip_before_action :require_login, only: [:create]
  skip_before_action :verify_authenticity_token, only: [:create, :destroy]

  # POST /api/sessions - Login
  def create
    user = User.find_by(username: params[:username])
    
    if user&.authenticate(params[:password])
      session[:user_id] = user.id
      render json: { 
        success: true, 
        user: { id: user.id, username: user.username } 
      }
    else
      render json: { error: 'Invalid username or password' }, status: :unauthorized
    end
  end

  # DELETE /api/sessions - Logout
  def destroy
    session[:user_id] = nil
    render json: { success: true }
  end

  # GET /api/sessions/current - Get current user
  def current
    if current_user
      render json: { 
        user: { id: current_user.id, username: current_user.username } 
      }
    else
      render json: { user: nil }
    end
  end
end
