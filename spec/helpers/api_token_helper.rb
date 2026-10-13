module APITokenHelper
  def api_token_for(user, auth_token_context: create(:auth_token_context, user:))
    Auth::Token::JWT.encode(
      payload: {
        user_key: user.key,
        token_identifier: auth_token_context.key,
      },
    )
  end
end
