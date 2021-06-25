Rails.application.routes.draw do
  get 'tetris/index'
  get 'tetris/select_mode'
  get 'tetris/operate_mode'  
  root "tetris#index"
end
