Rails.application.routes.draw do
  delete "" => "tetris#delete_access_all"
  get 'index' => "tetris#index"
  get 'select_mode' => "tetris#select_mode"
  get 'operate_mode' => "tetris#operate_mode"
  get 'ranking' => "tetris#ranking"
  get 'ranking/:page' => "tetris#ranking"
  # post 'ranking' => "tetris#ranking"

  post "add_record" => "tetris#add_record"
  post "count_access" => "tetris#count_access"
  root "tetris#index"
end