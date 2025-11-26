class Api::UsersController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:update_password]

  # PATCH /api/users/:id/password - Update password
  def update_password
    unless current_user
      return render json: { error: 'Unauthorized' }, status: :unauthorized
    end

    user = User.find(params[:id])
    
    # Ensure user can only update their own password
    unless current_user.id == user.id
      return render json: { error: 'Forbidden' }, status: :forbidden
    end

    # Verify current password
    unless user.authenticate(params[:current_password])
      return render json: { error: 'Current password is incorrect' }, status: :unprocessable_entity
    end

    # Update to new password
    if user.update(password: params[:new_password])
      render json: { success: true, message: 'Password updated successfully' }
    else
      render json: { error: user.errors.full_messages.join(', ') }, status: :unprocessable_entity
    end
  end
end
