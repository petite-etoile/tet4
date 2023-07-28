class CreateRankings < ActiveRecord::Migration[6.1]
  def change
    create_table :rankings do |t|
      t.text :name
      t.integer :score

      t.timestamps
    end
  end
end
