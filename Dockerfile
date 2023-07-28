# ベースとなるDockerイメージを指定. ここではRuby 2.7.3を使用.
FROM ruby:2.7.3

# 必要なパッケージをインストール.
RUN apt-get update -qq && apt-get install -y build-essential libpq-dev nodejs

# Yarnのインストール
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
    && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list \
    && apt-get update && apt-get install -y yarn


# 作業ディレクトリを設定.
WORKDIR /myapp

# ローカルマシンのGemfileとGemfile.lockをコピー.
COPY app/Gemfile /myapp/Gemfile
COPY app/Gemfile.lock /myapp/Gemfile.lock

# Bundlerを使ってgemをインストール.
RUN bundle install

# ローカルマシンのすべてのファイルをコピー.
COPY ./app /myapp

RUN yarn install
