Rails.application.routes.draw do
  if Rails.env.development?
    mount GraphiQL::Rails::Engine, at: "/graphiql", graphql_path: "/graphql"
  end
  post "/graphql", to: "graphql#execute"
  root "home#index"
  post "/fileupload", to: "uploads#post"
  get "*", to: "home#index"
end
