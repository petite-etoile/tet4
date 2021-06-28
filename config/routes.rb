Rails.application.routes.draw do
  get 'index' => "tetris#index"
  get 'select_mode' => "tetris#select_mode"
  get 'operate_mode' => "tetris#operate_mode"
  root "tetris#index"
end
