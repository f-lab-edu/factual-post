module.exports = [
    {
      ignores: ["node_modules"], 
    },
    {
      files: ["src/**/*.js"], 
      languageOptions: {
        parserOptions: {
          ecmaVersion: "latest", 
          sourceType: "module", 
        },
      },
      rules: {
        "no-unused-vars": "warn",       // 사용하지 않는 변수 경고
        "no-console": "warn",           // console 사용 금지
        "eqeqeq": ["warn", "always"],   // === 사용 강제
        "semi": ["error", "always"],    // 세미콜론 사용 강제
        "quotes": ["error", "single"],  // 작은 따옴표 사용 강제
        "indent": ["error", 4],         // 4칸 들여쓰기
        "max-len": ["error", { "code": 120 }], // 한 줄 길이 제한
        "no-var": "error",              // var 사용 금지
        "prefer-const": "error",        // const 사용 강제
        "consistent-return": "error",   // 함수에서 일관된 return 사용 강제
        "no-shadow": "error",           // 변수명 중복 금지
        "space-in-parens": ["error", "never"], // 괄호안에 공백을 추가
        "array-bracket-spacing": ["error", "always"], // 대괄호 안에 공백을 추가
        "object-curly-spacing": ["error", "always"], // 중괄호 안에 공백을 추가
        "newline-before-return": "error", // return 문 앞에 한 줄 이상의 공백을 요구
        "padded-blocks": ["error", { "blocks": "never" }], // 모든 블록 앞뒤에 빈 줄 추가
      },
    },
  ];