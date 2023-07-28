class Ranking < ApplicationRecord
    validates :name, length:{minimum:1, maximum:20, message:"名前は1文字以上20文字以下にしてください."} 
end
