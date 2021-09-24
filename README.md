# tetris4ren

↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓

http://tet4.herokuapp.com

↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

デモ動画
https://www.youtube.com/watch?v=gREynnKx2Rg

![【技育展2021】てとよん発表スライド](https://user-images.githubusercontent.com/33211163/134608992-350b3637-9895-49d2-894b-cb292417dcf9.jpeg)

![【技育展2021】てとよん発表スライド 2](https://user-images.githubusercontent.com/33211163/134608994-5052779d-b966-4b4e-bc24-841b5cfd9fae.jpeg)

テトリスというゲームは知っていますか？一度は見聞きしたことあるんじゃないかと思います.

昔のテトリスでは, 2列消しで1列, 3列消しで2列, 4列消しで4列相手に送られました.

しかし最近のテトリスではそれらに加えて, Tミノを特殊な入れ方をするTスピンや, 連続でライン消去をするRENなど, さまざまなテクニックがあります.![image](https://user-images.githubusercontent.com/33211163/134609176-192372ee-32e0-4422-ba60-aa6ec1d9ff3c.jpeg)


昔のテトリスでは, 1列を空けて積み上げて, 棒状のミノ(Iミノ)で4列消しを狙うのが定石でした.

しかし, このようなルールが追加されたことで, 様々な積み方・戦術で熱い対戦が繰り広げられています.

![【技育展2021】てとよん発表スライド 3](https://user-images.githubusercontent.com/33211163/134609021-91dd7f05-d245-4702-95b0-bc58a0e9eeae.jpeg)

今回のアプリは, このRENに関するものなので, RENを紹介します.

先程申したとおり, RENとは連続でライン消去を繰り返すことです.

この図の通り, RENは続けば続くほどとんでもない火力になります.

(ゲームによってこの火力設定は異なります)

![【技育展2021】てとよん発表スライド 4](https://user-images.githubusercontent.com/33211163/134609040-8da4a334-5349-4c94-adcf-2ee8a9d6fc32.jpeg)


このRENをできるだけ繋げるために考えられた戦術が, 4列RENです.

できるだけRENを繋げるためには, 1列ずつ消すことと, 消しやすい形にすることが重要です.

そのために4列RENでは,

4列のなかに3マス分だけ残すことで, 「1列消して3個残り, 1列消して3個残り...」を繰り返します.

ただし, RENを繋げることはそう簡単なことではありません.

![【技育展2021】てとよん発表スライド 5](https://user-images.githubusercontent.com/33211163/134609059-d5a8324f-7dba-45d1-adb1-77c6332470f0.jpeg)

ということで本題ですが,

このアプリでは, 4列RENを繋げる練習をサポートします！

![【技育展2021】てとよん発表スライド 6](https://user-images.githubusercontent.com/33211163/134609069-4ca92a00-04ac-44b9-b9a6-b777f212e411.jpeg)

まず, モードの１つ目である操作モードの紹介です.

このモードはキーボード操作で4列RENの練習ができます.

WASDでミノの移動, 矢印の左右でミノの回転, スペースでホールドができます.

基本的にゲームとして考えると自分で操作ができたほうが楽しいと思ったので, このモードを作成しました.

![【技育展2021】てとよん発表スライド 7](https://user-images.githubusercontent.com/33211163/134609083-25fe49dd-8389-4799-b368-da9bf4536581.jpeg)


次に, モードの２つ目である選択モードです.

このモードでは下にあるパネルをクリックすることでミノを置くあるいは, ホールドの選択をします

このモードには, ２つの意義があります.

![【技育展2021】てとよん発表スライド 8](https://user-images.githubusercontent.com/33211163/134609090-d9648c17-4b7c-4726-af83-08112e340d5d.jpeg)

1つ目ですが, 選択肢を表示することで, プレイヤーが思いつかなかった置き方を知ることができます.

というのも, 最近のテトリスではSuperRotationSystemと呼ばれる複雑な回転メソッドを採用しているので, 「回転入れ」という特殊な入れ方が存在するのです.

![【技育展2021】てとよん発表スライド 9](https://user-images.githubusercontent.com/33211163/134609101-a9b12893-b150-47fe-9fd1-e8b09eda8705.jpeg)

2つ目は, パソコンだけでなく, スマホでも遊べることです.

スマホで遊べることで電車や待ち合わせなどの隙間時間にプレイできるんですが,

現代人はスマホで時間をつぶすことが多いので, これはとても大きいと思っています.

![【技育展2021】てとよん発表スライド 10](https://user-images.githubusercontent.com/33211163/134609104-7a4e814b-af2c-443f-b4a2-4075234c869c.jpeg)

機能の紹介です.

5つの機能があり, その中で目玉機能を紹介します.

![【技育展2021】てとよん発表スライド 11](https://user-images.githubusercontent.com/33211163/134609109-df60bc66-8270-4bc9-a29f-0a02522c2227.jpeg)

目玉機能は, ルート案の表示です.

グラフ理論を用いて今の盤面から一番良いと思われる置き方を表示します.

この盤面からどうやってももうRENがつながらないだろう

というタイミングで使ったり, ゲームオーバーになったあとに, 一手戻すとルート案表示を組み合わせて, 改善点を見つけたり学習に使ってもらえます！

![【技育展2021】てとよん発表スライド 12](https://user-images.githubusercontent.com/33211163/134609130-31627503-d5c2-44f7-aff5-60bafd3deac9.jpeg)

![【技育展2021】てとよん発表スライド 13](https://user-images.githubusercontent.com/33211163/134609141-e71ffc50-1c6d-43ee-b8c3-43d1213c24f7.jpeg)
![【技育展2021】てとよん発表スライド 14](https://user-images.githubusercontent.com/33211163/134609143-7aaf18b6-9455-4f01-be02-f451bcc824e5.jpeg)
![【技育展2021】てとよん発表スライド 15](https://user-images.githubusercontent.com/33211163/134609146-1105b0a4-9ca5-42f5-aa88-9e64659a3499.jpeg)
![【技育展2021】てとよん発表スライド 16](https://user-images.githubusercontent.com/33211163/134609147-7d579815-b390-4f1e-9e17-a09737290a48.jpeg)
![【技育展2021】てとよん発表スライド 17](https://user-images.githubusercontent.com/33211163/134609150-f6ea772c-4017-4f36-b80d-76ad368738d8.jpeg)
![【技育展2021】てとよん発表スライド 18](https://user-images.githubusercontent.com/33211163/134609151-ddbdf7b7-7821-471a-aaa2-d3dbd9f4a125.jpeg)
![【技育展2021】てとよん発表スライド 19](https://user-images.githubusercontent.com/33211163/134609153-8031b5bd-1316-43d4-975b-beac711b24af.jpeg)
![【技育展2021】てとよん発表スライド 20](https://user-images.githubusercontent.com/33211163/134609155-97376fda-9e84-49c7-aa2b-07093cff3a18.jpeg)
![【技育展2021】てとよん発表スライド 21](https://user-images.githubusercontent.com/33211163/134609157-6b817e79-964d-4fa8-8a40-efc610a3c3d5.jpeg)
![【技育展2021】てとよん発表スライド 22](https://user-images.githubusercontent.com/33211163/134609159-921c8163-96c3-4af8-a5d5-16d6fb1efca3.jpeg)
![【技育展2021】てとよん発表スライド 23](https://user-images.githubusercontent.com/33211163/134609162-8fc31e36-41a5-497b-ba24-7998d1fc6b5d.jpeg)
![【技育展2021】てとよん発表スライド 24](https://user-images.githubusercontent.com/33211163/134609163-3e1573d0-b857-44d8-84f1-86bfb7ec720e.jpeg)


# 参考

* テトリスの回転ルール


https://lets-csharp.com/tetris-srs/

https://tetrisch.github.io/main/srs.html

* JSXの中でfor文を使う

https://qiita.com/ryuusan/items/900302fb307272acd122

* 4列RENの繋がりかた

https://tetrisopener.wicurio.com/index.php?4列RENの消し方

* キーコード

https://web-designer.cman.jp/javascript_ref/keyboard/keycode/

* JSのforEachは最終手段

https://qiita.com/diescake/items/70d9b0cbd4e3d5cc6fce

* bootstrap

https://getbootstrap.jp/docs/4.2/content/tables/



* jsのfetchでrailsとデータのやりとり

https://javascript.keicode.com/newjs/fetch.php
https://developer.mozilla.org/ja/docs/Web/API/FormData/FormData
https://qiita.com/tomoyukilabs/items/9b464c53450acc0b9574


* マイグレーション実行後のモデルの削除

https://ruemura3.com/2021/06/rails-destroy/#toc7

* created_atを日本時間に

https://qiita.com/tomo_k09/items/e4f19947d35890500492


* flex(CSS)

https://qiita.com/takanorip/items/a51989312160530d89a1
