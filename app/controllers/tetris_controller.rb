class TetrisController < ApplicationController
  layout "tetris"
  protect_from_forgery with: :null_session
  skip_before_action :verify_authenticity_token
  def index
    @page = "index"
  end

  def select_mode
    @page = "select_mode"
  end

  def operate_mode
    @page = "operate_mode"
  end

  def ranking
    @page = "ranking"
    @data = Ranking.all
  end
  
  def add_record
    # p params
    @ranking = Ranking.new(name: params[:name], score: params[:score])
    if @ranking.save()
      res = {
        message: "OK"
      }
    else
      res = {}
      @ranking.errors.messages.each do |key, vals|
        vals.each do |val|
          res[key] = val
        end
      end
    end

    render json:res
  end

  def record_params
    return params.require(:ranking).permit(:name, :score)
  end
end
