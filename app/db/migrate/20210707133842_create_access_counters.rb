class CreateAccessCounters < ActiveRecord::Migration[6.1]
  def change
    create_table :access_counters do |t|
      t.text :url
      t.integer :cnt

      t.timestamps
    end
  end
end
