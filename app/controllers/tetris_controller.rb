class TetrisController < ApplicationController
  layout "tetris"
  def index
    @page = "index"
  end

  def select_mode
    @page = "select_mode"
  end

  def operate_mode
    @page = "operate_mode"
  end
end
