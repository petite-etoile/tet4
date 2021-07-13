class TetrisController < ApplicationController
  layout "tetris"
  protect_from_forgery with: :null_session
  skip_before_action :verify_authenticity_token
  def index
    @page = "index"
    @access_count = 0
    AccessCounter.all.each do |obj|
      p obj
      @access_count += obj.cnt;
    end
  end

  def select_mode
    @page = "select_mode"
  end

  def operate_mode
    @page = "operate_mode"
  end

  def ranking
    @page = "ranking"



    if params[:sort_for]
      @sort_for = params[:sort_for]
    else
      @sort_for = "score desc"
    end
    @data = Ranking.all.order(@sort_for)


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
    scores = []
    @data.each do |obj|
      scores.append(obj.score)
    end

    scores.uniq!()
    p scores





    p @color_for_data
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

  def delete_access_all
    AccessCounter.destroy_all();
    puts "\n\nafter"
      AccessCounter.all.each do |obj|
        puts "#{obj.url} #{obj.cnt}"
      end
  end

end
