module.exports = {
  // ルールをまとめて追加
  extends: [
    "next/core-web-vitals",
    "plugin:import/recommended",
    "plugin:import/warnings",
    "prettier",
  ],
  // 個別ルール
  rules: {
    "import/order": [
      // importするファイルをアルファベット順に自動で並び替える
      "error",
      {
        alphabetize: {
          order: "asc",
        },
      },
    ],
    // importのパスにエイリアス（'@/components/xxxxx'）を使うとエラーになるのでそれを防ぐ
    "import/no-unresolved": "off",
  },
};
