class TetrisController < ApplicationController
  layout "tetris"
  protect_from_forgery with: :null_session
  skip_before_action :verify_authenticity_token
  def index
    @url = "index"
    @access_count = 0
    AccessCounter.all.each do |obj|
      p obj
      @access_count += obj.cnt;
    end
  end

  def select_mode
    @url = "select_mode"
  end

  def operate_mode
    @url = "operate_mode"
  end

  def ranking
    @url = "ranking"

    scores = []
    Ranking.all.each do |obj|
      scores.append(obj.score)
    end


    # 表示するデータの絞り込み(where)
    if(params[:user] and params[:user]!="")
      target_data = Ranking.where("name like ?", params[:user])
      @user = params[:user]
    else
      target_data = Ranking.all
    end

    # ソート方法
    if params[:sort_for]
      @sort_for = params[:sort_for]
    else
      @sort_for = "score desc"
    end
    @data = target_data.order(@sort_for)

    # 表示するデータの絞り込み(page)
    data_num_of_page = 100
    if(params[:page])
      @page = params[:page].to_i
    else
      @page = 1
    end
    @data = @data.slice(data_num_of_page * (@page - 1), data_num_of_page * @page)


    # 色を決める
    colors = ["gray", "brown", "green", "cyan", "blue", "yellow", "orange", "red"]
    @color_for_data = Array.new(@data.size(), "")
    
    @data.each_with_index do |obj, data_idx|
      (0...colors.size).each do |col_idx|
        if(obj.score <  30 + (20 * col_idx))
          @color_for_data[data_idx] = colors[col_idx]
          break
        end
      end
      
      if(@color_for_data[data_idx] == "")
        @color_for_data[data_idx] = colors.last()
      end
    end



    # 順位を決める
    @rank_for_data = Array.new(@data.size(), -1);
    

    scores.sort!
    p scores
    @data.each_with_index do |obj, idx|
      p obj.score
      @rank_for_data[idx] = scores.size - bisect_right(scores, obj.score) 
    end
    

  end

  def bisect_right(list, x)
    left = 0
    right = list.size()

    while right - left > 1
      mid = (right+left)/2
      if(x >= list[mid])
        left = mid
      else
        right = mid
      end
    end

    return left
  end
  
  def add_record
    p params
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

  def count_access
    p params

    obj = AccessCounter.find_by(url: params[:url])
    puts "url:#{params[:url]}"
    if(obj  == nil )
      obj = AccessCounter.new(url: params[:url], cnt: 1)
      if obj.save()
        p "新しいrefを登録成功"
      else
        p "新しいrefを登録失敗"
      end
    else
      puts "\n\nbefore"
      AccessCounter.all.each do |obj|
        puts "#{obj.url} #{obj.cnt}"
      end
      obj.update(url: params[:url], cnt: obj.cnt + 1)
      puts "\n\nafter"
      AccessCounter.all.each do |obj|
        puts "#{obj.url} #{obj.cnt}"
      end
    end

    p "アクセスデータ"
    AccessCounter.all.each do |obj|
      p "url: #{obj.url}, count: #{obj.cnt}"
    end

  end

  # def delete_access_all
  #   AccessCounter.destroy_all();
  #   puts "\n\nafter"
  #     AccessCounter.all.each do |obj|
  #       puts "#{obj.url} #{obj.cnt}"
  #     end
  # end

  # def all
  #   # return json:Ranking.all
  #   render json:Ranking.all
  #   # render json:{"a"=>"a"}
  # end

  # def delete
  #   obj = Ranking.find(params[:id])
  #   obj.destroy();
  # end

end
