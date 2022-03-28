# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.


## [0.32.5](https://github.com/frouriojs/create-frourio-app/compare/v0.32.4...v0.32.5) (2022-03-28)

### Bug Fixes


fix: fix how getting the version to show for `-v` (https://github.com/frouriojs/create-frourio-app/pull/345)

## [0.32.4](https://github.com/frouriojs/create-frourio-app/compare/v0.32.3...v0.32.4) (2022-03-23)


### Bug Fixes

- fix: template path (https://github.com/frouriojs/create-frourio-app/pull/339)

## [0.32.3](https://github.com/frouriojs/create-frourio-app/compare/v0.32.2...v0.32.3) (2022-03-23)


### Bug Fixes

- upgrade frourio and others (https://github.com/frouriojs/create-frourio-app/pull/339)

### Maintenance

- chore: replace builder with esbuild and output libs (https://github.com/frouriojs/create-frourio-app/pull/341)


## [0.32.2](https://github.com/frouriojs/create-frourio-app/compare/v0.32.1...v0.32.2) (2022-03-07)


### Bug Fixes

- fix: add await FastifyInject (https://github.com/frouriojs/create-frourio-app/pull/333)

## [0.32.1](https://github.com/frouriojs/create-frourio-app/compare/v0.32.0...v0.32.1) (2022-02-28)


### Maintenance

- upgrade frourio and others (https://github.com/frouriojs/create-frourio-app/pull/324)
- upgrade typescript (https://github.com/frouriojs/create-frourio-app/pull/323)

## [0.32.0](https://github.com/frouriojs/create-frourio-app/compare/v0.31.0...v0.32.0) (2022-02-22)


### Features

* Add pathpida to nextjs template (https://github.com/frouriojs/create-frourio-app/pull/296)

## [0.31.0](https://github.com/frouriojs/create-frourio-app/compare/v0.30.0...v0.31.0) (2022-02-15)


### Features

* feat: update aws-serverless-experss to @vendia/serverless-express and switching lambda support from fastify to express (https://github.com/frouriojs/create-frourio-app/pull/306)

## [0.30.0](https://github.com/frouriojs/create-frourio-app/compare/v0.29.0...v0.30.0) (2022-02-09)


### Features

* add `-v`, `--version`, `--host` options and improve CLI experience https://github.com/frouriojs/create-frourio-app/pull/285
* upgrade template dependencies
  * TypeScript v4.5 for other than nuxt
  * SWR v1.0
  * stylelint v14 for nuxt
  * eslint-plugin-nuxt v3

## [0.29.0](https://github.com/frouriojs/create-frourio-app/compare/v0.28.2...v0.29.0) (2022-02-07)


### Features

* change default pm value ([66a3c2b](https://github.com/frouriojs/create-frourio-app/commit/66a3c2bc35d8085074c6899a0b2707d83b04933d))
* intro pathpida ([56b6450](https://github.com/frouriojs/create-frourio-app/pull/268/commits/56b645003ffc9fd0bb6278f7212697c7a1b788ba),[32a3d9b](https://github.com/frouriojs/create-frourio-app/pull/267/commits/32a3d9b608e870d548f81de612abdf9bcfbec4bd))



### [0.28.2](https://github.com/frouriojs/create-frourio-app/compare/v0.28.1...v0.28.2) (2021-07-24)


### Bug Fixes

* fix database url env ([6c2467a](https://github.com/frouriojs/create-frourio-app/commit/6c2467a30612491a31202a943888e9de165c6a7c))
* add script migrate:dev:createonly ([64a93d2](https://github.com/frouriojs/create-frourio-app/commit/64a93d21943b9e9e87c063713e5a8ebd34595a37))

### [0.28.1](https://github.com/frouriojs/create-frourio-app/compare/v0.28.0...v0.28.1) (2021-07-12)


### Bug Fixes

* modules needed for build ([#240](https://github.com/frouriojs/create-frourio-app/issues/240)) ([f2d1296](https://github.com/frouriojs/create-frourio-app/commit/f2d1296d40cf42bdc434f88b3516ba4f1d9ead4e))

## [0.28.0](https://github.com/frouriojs/create-frourio-app/compare/v0.27.2...v0.28.0) (2021-04-23)


### Features

* remove eslint-plugin-prettier ([fa5d02f](https://github.com/frouriojs/create-frourio-app/commit/fa5d02ff70be97d95043ba47fd88f942b6dd3257))
* update aspida and frourio ([a42f27c](https://github.com/frouriojs/create-frourio-app/commit/a42f27cbb40feaf7f62a4bd71373949170b6eff6))

### [0.27.2](https://github.com/frouriojs/create-frourio-app/compare/v0.27.1...v0.27.2) (2021-03-17)


### Bug Fixes

* get random port for server from 10000-59999 ([#215](https://github.com/frouriojs/create-frourio-app/issues/215)) ([b16ab8c](https://github.com/frouriojs/create-frourio-app/commit/b16ab8c1017c4f06bdd789df105d5e6474136359))
* **template/nuxt:** add ts-loader to dev-dep and remove @nuxt/typescript-runtime ([#223](https://github.com/frouriojs/create-frourio-app/issues/223)) ([b6d472a](https://github.com/frouriojs/create-frourio-app/commit/b6d472a2e6998be1c7e70ec1843f79078ff57ec0))

### [0.27.1](https://github.com/frouriojs/create-frourio-app/compare/v0.27.0...v0.27.1) (2021-03-03)


### Bug Fixes

* open from server-side ([#207](https://github.com/frouriojs/create-frourio-app/issues/207)) ([8864d39](https://github.com/frouriojs/create-frourio-app/commit/8864d39f318a96f0721c1f8654cdc3db9a16ee05))

## [0.27.0](https://github.com/frouriojs/create-frourio-app/compare/v0.26.4...v0.27.0) (2021-02-28)


### Features

* separate database info to save ([#193](https://github.com/frouriojs/create-frourio-app/issues/193)) ([6848907](https://github.com/frouriojs/create-frourio-app/commit/684890790b56699c1b9a67badf65e6676e0ddbf6))


### Bug Fixes

* **template:** configure @rollup/plugin-json for sapper to build client successfully ([#200](https://github.com/frouriojs/create-frourio-app/issues/200)) ([9b27524](https://github.com/frouriojs/create-frourio-app/commit/9b2752447773c5233d76a39389f559b167f57bf7))
* test is run under root repository, but node_modules/ on root will be used accidentally. ([#195](https://github.com/frouriojs/create-frourio-app/issues/195)) ([daa84c4](https://github.com/frouriojs/create-frourio-app/commit/daa84c4f5ce3d49f8404d9fcb697cbabde1a8a3b))
* **template:** refactor next pages test ([#194](https://github.com/frouriojs/create-frourio-app/issues/194)) ([e5ae8d0](https://github.com/frouriojs/create-frourio-app/commit/e5ae8d08652aa52144fbcec1a43663547a53347e))

### [0.26.4](https://github.com/frouriojs/create-frourio-app/compare/v0.26.3...v0.26.4) (2021-02-24)


### Bug Fixes

* properly skip database connection checks ([#189](https://github.com/frouriojs/create-frourio-app/issues/189)) ([af5581c](https://github.com/frouriojs/create-frourio-app/commit/af5581c92c91a17145043686431ee6682b206cea))

### [0.26.3](https://github.com/frouriojs/create-frourio-app/compare/v0.26.2...v0.26.3) (2021-02-24)


### Features

* **template:** switching to use API_UPLOAD_DIR, /upload/ as endopoint, and use ./server/upload as default .env ([#186](https://github.com/frouriojs/create-frourio-app/issues/186)) ([963f19e](https://github.com/frouriojs/create-frourio-app/commit/963f19e66a154375a4445b5314024cee2d972d4d))


### Bug Fixes

* decode as utf-8 only text files ([#182](https://github.com/frouriojs/create-frourio-app/issues/182)) ([46b433f](https://github.com/frouriojs/create-frourio-app/commit/46b433f9218483e359150bbf025bea92f115575d))
* sapper typecheck and fix error ([#184](https://github.com/frouriojs/create-frourio-app/issues/184)) ([c18314c](https://github.com/frouriojs/create-frourio-app/commit/c18314c9558f8cecb23e0d2982684f268f9c4d4d))

### [0.26.2](https://github.com/frouriojs/create-frourio-app/compare/v0.26.1...v0.26.2) (2021-02-22)


### Bug Fixes

* move real-executable-path to dependencies ([98ad6d5](https://github.com/frouriojs/create-frourio-app/commit/98ad6d574603b6db0d5ff22e61fe394979e88a68))

### [0.26.1](https://github.com/frouriojs/create-frourio-app/compare/v0.26.0...v0.26.1) (2021-02-22)


### Bug Fixes

* require fastify-nextjs only development mode ([115e496](https://github.com/frouriojs/create-frourio-app/commit/115e496a841c310cda7ad3554ab01a1313d72279))

## [0.26.0](https://github.com/frouriojs/create-frourio-app/compare/v0.25.0...v0.26.0) (2021-02-22)


### Features

* create only when target directory does not exist or empty ([#174](https://github.com/frouriojs/create-frourio-app/issues/174)) ([53a7385](https://github.com/frouriojs/create-frourio-app/commit/53a73854d8214b3b888e4cc897a500c3d6552e79))
* open automatically dev client url after initialized ([#172](https://github.com/frouriojs/create-frourio-app/issues/172)) ([395d64c](https://github.com/frouriojs/create-frourio-app/commit/395d64c1f98ceba8ee6b5ca5387d662e63f1c5d0))
* **react:** show error line only after the input was touched ([#168](https://github.com/frouriojs/create-frourio-app/issues/168)) ([b90ca17](https://github.com/frouriojs/create-frourio-app/commit/b90ca17c4d26148f6a5c13c16af9a4b365443da9))
* **templates:** add fields to ormconfig ([#171](https://github.com/frouriojs/create-frourio-app/issues/171)) ([472dae1](https://github.com/frouriojs/create-frourio-app/commit/472dae1c29c9108c026955214d1d6229b0daa283))
* add context interface to nuxt aspida plugin ([7d94e21](https://github.com/frouriojs/create-frourio-app/commit/7d94e21fc8278a3277d86986dfc0ea1ef0d09cc7))
* **template-typeorm:** put together typeorm scripts. ([bfb1e20](https://github.com/frouriojs/create-frourio-app/commit/bfb1e207a6f6992b6f11ad1d508be622517afdc4))
* add options to deployments and refactoring ([ebe4f95](https://github.com/frouriojs/create-frourio-app/commit/ebe4f952a08a55473ea4767e7e39476d6906f13a))
* example.env and new env TEST_CFA_FIX_CLIENT ([fae57b4](https://github.com/frouriojs/create-frourio-app/commit/fae57b48f52cf303d57570f887fd9710ca65a292))
* more flip ([24bd349](https://github.com/frouriojs/create-frourio-app/commit/24bd349fda4e78e4c2de17173f75e65c2abbdcad))
* package-json generating from single source ([f043e54](https://github.com/frouriojs/create-frourio-app/commit/f043e54234e8fc09837359a9488b2c4d2ab9dec0))
* split package.json dependencies out ([8218928](https://github.com/frouriojs/create-frourio-app/commit/8218928805fda455b8939cab5bd6b5b1511524b0))
* use mysql2 instead of mysql. mysql does not support mysql8 fully ([601a173](https://github.com/frouriojs/create-frourio-app/commit/601a17301524ecc7e40e52e07502839808b97423))


### Bug Fixes

* .env value ([6df5bdf](https://github.com/frouriojs/create-frourio-app/commit/6df5bdfc938accab033e813866f74c04745ba986))
* .env.example for typeorm ([f12f1d5](https://github.com/frouriojs/create-frourio-app/commit/f12f1d55642f04a321ce5db3f6d1fd9a408463ac))
* button a11y ([8efd683](https://github.com/frouriojs/create-frourio-app/commit/8efd6835e17797959a6fec174f2b02cccd881df9))
* canCreate validation ([1dd2ced](https://github.com/frouriojs/create-frourio-app/commit/1dd2ced1db2a04856288a83765f69bf19654b95d))
* check whether the input is empty or not, and refactor ([#169](https://github.com/frouriojs/create-frourio-app/issues/169)) ([2ba0ae4](https://github.com/frouriojs/create-frourio-app/commit/2ba0ae4adc3fddc84b921bffd4f32ea350e0fa97))
* env and gitignore ([835818b](https://github.com/frouriojs/create-frourio-app/commit/835818b2311d8448eae9993546c1e86e9482d1d0))
* fastify, fastify-cors in dev-dep only when express ([e71cf8e](https://github.com/frouriojs/create-frourio-app/commit/e71cf8e4b8704b4a8f7bdcd854a6062507fee2cb))
* fix tsconfig ([502ebb6](https://github.com/frouriojs/create-frourio-app/commit/502ebb670c7116695dc56c753b1be4ac047b0fb5))
* flip animation fix and websocket for production ([a9c28e5](https://github.com/frouriojs/create-frourio-app/commit/a9c28e52ef69278a54febcef203e48890717cc55))
* improve windows support using real-executable-path ([b37cbb1](https://github.com/frouriojs/create-frourio-app/commit/b37cbb1d52291efe15247dc1b66bf115dee66802))
* nextjs typecheck ([665b946](https://github.com/frouriojs/create-frourio-app/commit/665b9466f95bad8ceda145543136f52f25df7414))
* node.js 10 ([2152065](https://github.com/frouriojs/create-frourio-app/commit/21520657de93c6ede3c111241c378586a2bc3de5))
* pretense package.json and lock ([9d8dc12](https://github.com/frouriojs/create-frourio-app/commit/9d8dc12f4be7c48d89609267c4ed577aea4f7369))
* prsima should be installed in server dev dep ([8ea8c92](https://github.com/frouriojs/create-frourio-app/commit/8ea8c9244e3bf80fbf80334ca6f8b123094b076f))
* remove dbModules remained ([f4a2818](https://github.com/frouriojs/create-frourio-app/commit/f4a2818a1ac77899d29c2b0b1df16e992517e9da))
* remove unnecessary import ([c5e334b](https://github.com/frouriojs/create-frourio-app/commit/c5e334b29a6ac70cce5d2a83f3bbcfa1adbe077c))
* revert loading prev answer ([484a9c0](https://github.com/frouriojs/create-frourio-app/commit/484a9c093163fad7aac1e568ae5e8bb1db539e5f))
* run tests some times and fix them all ([579ff49](https://github.com/frouriojs/create-frourio-app/commit/579ff492b31b6ef712912c0ee399ae98b2f43761))
* template ([f93d2f2](https://github.com/frouriojs/create-frourio-app/commit/f93d2f2c2aaa78bcb42677d4393215df84d75990))
* typecheck (skipLibChecks) ([228f17b](https://github.com/frouriojs/create-frourio-app/commit/228f17b0cc1b76768bbad43e48320aa751f60ce0))
* use `waitFor` because `waitForDomChange` is already deprecated. ([#167](https://github.com/frouriojs/create-frourio-app/issues/167)) ([016d62b](https://github.com/frouriojs/create-frourio-app/commit/016d62b58cc3e1c9e5c29bfda280d83f050847fe))
* **template:** not use prisma cli in client side package.json ([e015a6e](https://github.com/frouriojs/create-frourio-app/commit/e015a6e6c08191db323fcedcb06ca7c87568de6d))
* **test:** run migrations ([417062a](https://github.com/frouriojs/create-frourio-app/commit/417062aa0de7015b7e6576999b84405affab1247))
* **test:** use cwd change instead of npm --prefix ([6d90632](https://github.com/frouriojs/create-frourio-app/commit/6d906325b46d992f24a496ffcd705ba2edc27f1d))
* **windows:** .bin/typeorm is not js file on windows ([8eb4395](https://github.com/frouriojs/create-frourio-app/commit/8eb4395d6e48707ec9139760ccc9516b6e1f6c51))
* revert test snapshots ([b14e993](https://github.com/frouriojs/create-frourio-app/commit/b14e99355670dfb0833b4e91dec35998ab86ec77))
* run some more tests and fix them around typeorm ([246f946](https://github.com/frouriojs/create-frourio-app/commit/246f946b5ead03047d448dc8adbbbb96fcdc1a23))
* support node.js using rimraf for recursive removing ([b353904](https://github.com/frouriojs/create-frourio-app/commit/b3539041794798cb354e76cbcb9ca5296c8a1326))
* template ([4300c5c](https://github.com/frouriojs/create-frourio-app/commit/4300c5cd17fa0d3f68528cb46a84c565a488e0fa))
* test ([230a067](https://github.com/frouriojs/create-frourio-app/commit/230a0675bdd587edc4f58e09b8a94f1c5b393023))
* test ([edf9650](https://github.com/frouriojs/create-frourio-app/commit/edf96509eb98849f978c8d26a3ef80de174c99f8))
* test ([435980a](https://github.com/frouriojs/create-frourio-app/commit/435980a913c7a8ecfea2a7da5697deea6be79b68))
* tests; swapped typeorm deps, fastify and express rejects another reponse ([4f35949](https://github.com/frouriojs/create-frourio-app/commit/4f35949a7909a5733a248b5c58f92da0ea4e2367))
* typeorm db deps ([b1280f0](https://github.com/frouriojs/create-frourio-app/commit/b1280f0f2f0d672ff9668e809fad13840b22d87a))
* typeorm env settings ([74651a8](https://github.com/frouriojs/create-frourio-app/commit/74651a82c3906e0d3bf95764a1e598a9204d5ba3))
* typeorm typing, move test ot generate all ([7190e1b](https://github.com/frouriojs/create-frourio-app/commit/7190e1bb0bdf62a67ef013ae02ce71000a5414ba))
* typings ([f6d24d1](https://github.com/frouriojs/create-frourio-app/commit/f6d24d1e68d37f2aba4d4e9d891987c1008b0af6))
* use rmdir recursive instead ([64e508d](https://github.com/frouriojs/create-frourio-app/commit/64e508dbd5dae5e62fdda32a6a94f33b5ff062bb))


### Tests

* stability on Windows ([c34626f](https://github.com/frouriojs/create-frourio-app/commit/c34626f5060884b819c8a4d6f0e204a7a51d72c0))
* support on windows ([a26e7b6](https://github.com/frouriojs/create-frourio-app/commit/a26e7b6b639345f7f1230eaf0b03efea335d6468))
* support on windows ([6ebb389](https://github.com/frouriojs/create-frourio-app/commit/6ebb3898d9d214f8cceb0020dd61e5e6a85b9ef2))
* TEST_CFA_RANDOM_NUM default to 1 ([a62c460](https://github.com/frouriojs/create-frourio-app/commit/a62c460dd98037398a303a380676f3e6cd8d1083))
* win ([ae54bb8](https://github.com/frouriojs/create-frourio-app/commit/ae54bb80eccee1a1adf281b7a5309595e68f165a))


### Refactors

* dev db info input message ([df7d91f](https://github.com/frouriojs/create-frourio-app/commit/df7d91f3fe6ac9f81232bcffeceb8982cbd15dd7))
* **test:** skip if failing test clean up ([226c06c](https://github.com/frouriojs/create-frourio-app/commit/226c06cc2fd8edf90c6de92cba5fd730b96829ca))
* console.error appearance ([82e9c2a](https://github.com/frouriojs/create-frourio-app/commit/82e9c2a365a2031f0c3f8ef475c1483df32acc86))
* lint ([f64637c](https://github.com/frouriojs/create-frourio-app/commit/f64637c5ac48996a90e8772f4f070b16a3ab6af8))
* test ([d525724](https://github.com/frouriojs/create-frourio-app/commit/d5257246d43303b71d1cc709f0c19956d1c40327))

## [0.25.0](https://github.com/frouriojs/create-frourio-app/compare/v0.24.1...v0.25.0) (2021-02-07)


### Features

* **template:** add throwHttpErrors option ([dcc19e8](https://github.com/frouriojs/create-frourio-app/commit/dcc19e853fd3718f206b28b84bede623e5a601f6))
* **template:** rename @prisma/cli to prisma ([6392fa3](https://github.com/frouriojs/create-frourio-app/commit/6392fa336734dd895800610c4249bf8e04321ea5))


### Bug Fixes

* add dbHost due to a bug in prisma ([d21f78a](https://github.com/frouriojs/create-frourio-app/commit/d21f78aaddc109861a33c3cb954daf22a4e9155e))
* **template:** update aspida@1.4.1 ([8160ad9](https://github.com/frouriojs/create-frourio-app/commit/8160ad981f21846756d5bb8bd23958fcf7f05ae4))

### [0.24.1](https://github.com/frouriojs/create-frourio-app/compare/v0.24.0...v0.24.1) (2021-01-18)


### Features

* update modules ([ac75aa3](https://github.com/frouriojs/create-frourio-app/commit/ac75aa3e16dbb8481a17db843a63891bc09bca48))


### Bug Fixes

* add typeorm migration file of postgres ([8cf9abf](https://github.com/frouriojs/create-frourio-app/commit/8cf9abf7388a973e04096d9a7bc18075445d02f7))

## [0.24.0](https://github.com/frouriojs/create-frourio-app/compare/v0.23.0...v0.24.0) (2021-01-08)


### Features

* add reactHooks as a choice ([170191c](https://github.com/frouriojs/create-frourio-app/commit/170191c9abbba2958172d1d0da2fc55af86eff5d))

## [0.23.0](https://github.com/frouriojs/create-frourio-app/compare/v0.22.1...v0.23.0) (2020-12-30)


### Features

* add type only imports ([f393d30](https://github.com/frouriojs/create-frourio-app/commit/f393d306ef3092bb4d2c7a3d4e220aed7cbfcb6e))


### Bug Fixes

* jest error with fetch client ([b053737](https://github.com/frouriojs/create-frourio-app/commit/b0537378b275eb13faaa21ce0b279142c8ba431a))

### [0.22.1](https://github.com/frouriojs/create-frourio-app/compare/v0.22.0...v0.22.1) (2020-12-19)


### Bug Fixes

* add env to nodejs.yml when nextjs ([63d4969](https://github.com/frouriojs/create-frourio-app/commit/63d4969b0047de0c93d8644f0f14cc951726c4e9))

## [0.22.0](https://github.com/frouriojs/create-frourio-app/compare/v0.21.5...v0.22.0) (2020-12-19)


### Features

* add @testing-library/react to nextjs ([d6942fd](https://github.com/frouriojs/create-frourio-app/commit/d6942fd0b65543210faaf2d049d49adc91047934))
* update sapper modules ([c3fc541](https://github.com/frouriojs/create-frourio-app/commit/c3fc54192a56c91bb95914feb90f4e8b84078660))
* update test of nuxtjs ([2183fbf](https://github.com/frouriojs/create-frourio-app/commit/2183fbf4a17f8f9f6186500c0ff56d01b0803caf))

### [0.21.5](https://github.com/frouriojs/create-frourio-app/compare/v0.21.4...v0.21.5) (2020-12-16)


### Bug Fixes

* **nestjs:** change mutate to revalidate ([eb93f8e](https://github.com/frouriojs/create-frourio-app/commit/eb93f8ecdc81bbb7da92ae1c01aba53c4b983094))
* ignore mysql8 connection err on prisma ([65f0100](https://github.com/frouriojs/create-frourio-app/commit/65f01009364bd0af052e39213cad2e4f0be60fab))

### [0.21.4](https://github.com/frouriojs/create-frourio-app/compare/v0.21.3...v0.21.4) (2020-12-15)


### Features

* change default db of prisma to splite ([a7ce2b2](https://github.com/frouriojs/create-frourio-app/commit/a7ce2b29decddc896d4d2523883c730de68db550))


### Bug Fixes

* typo (dammy => dummy) ([bafadcb](https://github.com/frouriojs/create-frourio-app/commit/bafadcbeea0d1bb62a30538ae07ead62a75e7e29))
* typo (lavel => label) ([10d898d](https://github.com/frouriojs/create-frourio-app/commit/10d898da6b3e71e58ae55986023ba9c119145437))
* typo (separete => separate) ([8f39d29](https://github.com/frouriojs/create-frourio-app/commit/8f39d29a9a8cfb72126462320e939a92e2d741c1))

### [0.21.3](https://github.com/frouriojs/create-frourio-app/compare/v0.21.2...v0.21.3) (2020-12-15)


### Bug Fixes

* **sapper:** err of importing @aspida/axios ([e98f8ae](https://github.com/frouriojs/create-frourio-app/commit/e98f8ae7d24fc09f35e559e577222038a640ea69))

### [0.21.2](https://github.com/frouriojs/create-frourio-app/compare/v0.21.1...v0.21.2) (2020-12-15)


### Bug Fixes

* check db connection with all answers ([76fe211](https://github.com/frouriojs/create-frourio-app/commit/76fe21154fbb21a3b8bc063f9a206226e6445bd3))

### [0.21.1](https://github.com/frouriojs/create-frourio-app/compare/v0.21.0...v0.21.1) (2020-12-14)


### Bug Fixes

* add @types/jest to server ([f3fe713](https://github.com/frouriojs/create-frourio-app/commit/f3fe7134d29ed2fa45c2482244a81da0a6bb04e5))
* eslintignore of nextjs ([7d2f513](https://github.com/frouriojs/create-frourio-app/commit/7d2f513b6ab512cc0972acc3ba421e0536f3f300))

## [0.21.0](https://github.com/frouriojs/create-frourio-app/compare/v0.20.0...v0.21.0) (2020-12-14)


### Features

* add vue components test ([f7698d2](https://github.com/frouriojs/create-frourio-app/commit/f7698d262ab07f3d3c993e7fbfb28d166a8b396b))
* check db connection before creating ([bb1cd16](https://github.com/frouriojs/create-frourio-app/commit/bb1cd1643704ebc825a523a8b1a4597e1f2ee4f2))
* update aspida@1.1.0 and frourio@0.21.3 ([9cd10a8](https://github.com/frouriojs/create-frourio-app/commit/9cd10a8ac0031fb4950f347810710b069318647d))
* **sapper:** change webpack to rollup ([ac490e2](https://github.com/frouriojs/create-frourio-app/commit/ac490e24f5fcdc6ca2ec9fdc7f105503d732cff4))


### Bug Fixes

* add createDBFileIfNotExists ([1c95abb](https://github.com/frouriojs/create-frourio-app/commit/1c95abb90f6668ae04aff6c10494883d8dd7ebf6))
* generate prisma on client ([3600bfc](https://github.com/frouriojs/create-frourio-app/commit/3600bfc36fb601896dea035bc4ef11e5ac14aaa2))
* lint of tasks.ts ([286eff9](https://github.com/frouriojs/create-frourio-app/commit/286eff927fac82cd6f2a6f2b5da50c7ab190725b))
* **sapper:** add node-fetch ([8be19c0](https://github.com/frouriojs/create-frourio-app/commit/8be19c0bade203c0d1551df51e7dcf894c878d3b))

## [0.20.0](https://github.com/frouriojs/create-frourio-app/compare/v0.19.1...v0.20.0) (2020-12-09)


### Features

* update prisma@2.13.0 ([a16f810](https://github.com/frouriojs/create-frourio-app/commit/a16f810d916affeb856423081efb671b10dff056))

### [0.19.1](https://github.com/frouriojs/create-frourio-app/compare/v0.19.0...v0.19.1) (2020-12-05)


### Bug Fixes

* remove jest type ([ebde448](https://github.com/frouriojs/create-frourio-app/commit/ebde448932ebd0e7b0c08cf65620a770cfee3449))

## [0.19.0](https://github.com/frouriojs/create-frourio-app/compare/v0.18.0...v0.19.0) (2020-12-05)


### Features

* add sapper ([8abe347](https://github.com/frouriojs/create-frourio-app/commit/8abe3475a54104e1a6c70f14dd671f97304d6bee))


### Bug Fixes

* gitignore ([cd60469](https://github.com/frouriojs/create-frourio-app/commit/cd60469160ce085c87fb2833c0d10c06b9e92d66))
* go to app after getting serverPort ([67cf8da](https://github.com/frouriojs/create-frourio-app/commit/67cf8da679333d96f8301f884a9954e6867a24a0))

## [0.18.0](https://github.com/frouriojs/create-frourio-app/compare/v0.17.0...v0.18.0) (2020-11-29)


### Features

* add ci configs ([ddaf221](https://github.com/frouriojs/create-frourio-app/commit/ddaf221340c92a45362f55aafc0ee9f74a38f4a7))
* change fastify-auth to fastify-jwt ([4499502](https://github.com/frouriojs/create-frourio-app/commit/449950215b5bb17974724ef1d099eb2bb1b9bae9))
* change passport to express-jwt ([e5055ee](https://github.com/frouriojs/create-frourio-app/commit/e5055eecbf5257bf808e6749f1863de82ecec8ea))
* optimize snapshot ([db72a41](https://github.com/frouriojs/create-frourio-app/commit/db72a4167b6a0d6e8a0aca4df3713fd7c6cd7718))
* update frourio@0.21.0 ([e2249eb](https://github.com/frouriojs/create-frourio-app/commit/e2249eb0f7e08580561b6de47254141c6eba0e33))


### Bug Fixes

* add database to services ([88e09c3](https://github.com/frouriojs/create-frourio-app/commit/88e09c3f0f34c099627db86817534542ab780844))
* ci configs ([3abd460](https://github.com/frouriojs/create-frourio-app/commit/3abd4607a9e671b7565bb5cea2feb677841bfcdd))

## [0.17.0](https://github.com/frouriojs/create-frourio-app/compare/v0.16.5...v0.17.0) (2020-11-08)


### ⚠ BREAKING CHANGES

* rename front to client

### Features

* add cli test ([c7b8568](https://github.com/frouriojs/create-frourio-app/commit/c7b85684f32bfb9f381ff101502c6511d0f7b2a8))
* add snapshot ([7891bd9](https://github.com/frouriojs/create-frourio-app/commit/7891bd9995b58f562f0ae0d2c503c7274aff180f))
* add snapshot test ([8e6f4dd](https://github.com/frouriojs/create-frourio-app/commit/8e6f4dd2a3d5539a60aaf144eb429df8b9e6f613))


### Bug Fixes

* rename front to client ([5ae117f](https://github.com/frouriojs/create-frourio-app/commit/5ae117f06e0fcce54a4fbb9704f34bec9f2eb812))

### [0.16.5](https://github.com/frouriojs/create-frourio-app/compare/v0.16.4...v0.16.5) (2020-11-07)


### Bug Fixes

* add node-fetch for nuxt SSR ([81ae4ee](https://github.com/frouriojs/create-frourio-app/commit/81ae4ee2cdb2c24303e0544a6aa8c574635eee2c))

### [0.16.4](https://github.com/frouriojs/create-frourio-app/compare/v0.16.3...v0.16.4) (2020-11-07)


### Features

* update frourio for node v10 ([8127c5f](https://github.com/frouriojs/create-frourio-app/commit/8127c5f1102ac11dc7440abf10182aae6a5a3e91))

### [0.16.3](https://github.com/frouriojs/create-frourio-app/compare/v0.16.2...v0.16.3) (2020-11-06)


### Bug Fixes

* handle error when json is empty ([dfe396d](https://github.com/frouriojs/create-frourio-app/commit/dfe396de40b1393df8b0837556d0ff87ce860fc8))

### [0.16.2](https://github.com/frouriojs/create-frourio-app/compare/v0.16.1...v0.16.2) (2020-11-04)


### Bug Fixes

* add args to getTasks ([98356a7](https://github.com/frouriojs/create-frourio-app/commit/98356a710af13eddaa92f2a1811b14038b61ed30))

### [0.16.1](https://github.com/frouriojs/create-frourio-app/compare/v0.16.0...v0.16.1) (2020-10-28)


### Features

* update frourio@0.19.0 ([fc897be](https://github.com/frouriojs/create-frourio-app/commit/fc897be1c3499eacc9e6fbfb45502f545c7f7910))

## [0.16.0](https://github.com/frouriojs/create-frourio-app/compare/v0.15.6...v0.16.0) (2020-10-25)


### Features

* add cli only mode ([17c14ce](https://github.com/frouriojs/create-frourio-app/commit/17c14cebcbdeec86c9f9fd82fb122c8435863d7f))

### [0.15.6](https://github.com/frouriojs/create-frourio-app/compare/v0.15.5...v0.15.6) (2020-10-24)


### Features

* update frourio@0.18.1 ([caa856f](https://github.com/frouriojs/create-frourio-app/commit/caa856f546d274e616e632ab597f73682982ed3d))

### [0.15.5](https://github.com/frouriojs/create-frourio-app/compare/v0.15.4...v0.15.5) (2020-10-21)


### Bug Fixes

* remove error log ([d6fb6c2](https://github.com/frouriojs/create-frourio-app/commit/d6fb6c2b4bfb55a5420cbb9f220caa20b6844ec7))

### [0.15.4](https://github.com/frouriojs/create-frourio-app/compare/v0.15.3...v0.15.4) (2020-10-21)


### Bug Fixes

* catch err of open ([11306dc](https://github.com/frouriojs/create-frourio-app/commit/11306dcb04ab68a938c3417cb5337fed0675d747))

### [0.15.3](https://github.com/frouriojs/create-frourio-app/compare/v0.15.2...v0.15.3) (2020-10-19)


### Bug Fixes

* remove postinstall ([e3be35d](https://github.com/frouriojs/create-frourio-app/commit/e3be35d46e3834c30dc62a0317d7737da434de60))

### [0.15.2](https://github.com/frouriojs/create-frourio-app/compare/v0.15.1...v0.15.2) (2020-10-19)


### Bug Fixes

* change to cross-spawn for windows ([18dba74](https://github.com/frouriojs/create-frourio-app/commit/18dba74e6d6e194e0a97cda5464e8e0eefad3a51))

### [0.15.1](https://github.com/frouriojs/create-frourio-app/compare/v0.15.0...v0.15.1) (2020-10-19)


### Bug Fixes

* add .env of templates ([65c9bce](https://github.com/frouriojs/create-frourio-app/commit/65c9bceb6e3f4f6f86c40eb4497f555928a01747))

## [0.15.0](https://github.com/frouriojs/create-frourio-app/compare/v0.14.3...v0.15.0) (2020-10-19)


### Features

* stable design ([55cea74](https://github.com/frouriojs/create-frourio-app/commit/55cea749f5c56114ed9e4f52884995b3444b8cd0))
* update frourio@0.18.0 ([6a98b3f](https://github.com/frouriojs/create-frourio-app/commit/6a98b3f54ed54a8bb42a8939e4f1180cb1d2c00e))


### Bug Fixes

* delete open-editor ([ba91bd1](https://github.com/frouriojs/create-frourio-app/commit/ba91bd127bedda50ac3371bdf046b2dae6cae332))
* lint error ([41c10f3](https://github.com/frouriojs/create-frourio-app/commit/41c10f37c46e932dbe79154cb30432a638748c04))
* restore state when reloading page ([48376a6](https://github.com/frouriojs/create-frourio-app/commit/48376a679b1246b057d9e3f72e0c7f5dd5447e96))


### Documentation

* add desktop image ([409cf9c](https://github.com/frouriojs/create-frourio-app/commit/409cf9c9fbef6cc126e91d276a2440f2bb3e39d6))

### [0.14.3](https://github.com/frouriojs/create-frourio-app/compare/v0.14.2...v0.14.3) (2020-10-17)


### Features

* **gui:** add bin/index.js ([93976c3](https://github.com/frouriojs/create-frourio-app/commit/93976c35bcaa6c1883082257fde159edfb0810c9))
* add saofiles ([32fe9ca](https://github.com/frouriojs/create-frourio-app/commit/32fe9ca5a5e9969fa415d591a94a02b9d55be7f5))
* **gui:** add api ([907b1e0](https://github.com/frouriojs/create-frourio-app/commit/907b1e0b4a5ca28724506c54b8aeb8419a66c6e6))
* **gui:** add prompts ([ac684e7](https://github.com/frouriojs/create-frourio-app/commit/ac684e7f000d4a1ffbebd088b40121a22c8fa0a0))
* add gui directory ([3824bad](https://github.com/frouriojs/create-frourio-app/commit/3824bad0747888f6a824b441435031f610f728ee))
* update frourio@0.17.2 ([569d3cd](https://github.com/frouriojs/create-frourio-app/commit/569d3cd7f3e85031c92de6a77bf1c1b18d630887))


### Bug Fixes

* add dummy env to npm command for windows ([4cbf1de](https://github.com/frouriojs/create-frourio-app/commit/4cbf1deefd6dc8a86f8e2e05696b93fc13d59624))

### [0.14.2](https://github.com/frouriojs/create-frourio-app/compare/v0.14.1...v0.14.2) (2020-10-16)


### Bug Fixes

* typecheck and lint ([2cc94eb](https://github.com/frouriojs/create-frourio-app/commit/2cc94ebc0a42e8827d1bbd952100605e2e2b2155))

### [0.14.1](https://github.com/frouriojs/create-frourio-app/compare/v0.14.0...v0.14.1) (2020-10-11)


### Features

* update frourio@0.17.1 ([ec9f744](https://github.com/frouriojs/create-frourio-app/commit/ec9f7447bed1b690e9407055ad18ca840c947f84))

## [0.14.0](https://github.com/frouriojs/create-frourio-app/compare/v0.13.1...v0.14.0) (2020-10-09)


### Features

* add testing ([52043ac](https://github.com/frouriojs/create-frourio-app/commit/52043ac2e8bdc0b9d1ef620dbe2111cb5190f5cd))

### [0.13.1](https://github.com/frouriojs/create-frourio-app/compare/v0.13.0...v0.13.1) (2020-10-09)


### Features

* update frourio@0.17.0 ([f9baf11](https://github.com/frouriojs/create-frourio-app/commit/f9baf11e07226bb4679b359aefa2ad61f6ba2739))

## [0.13.0](https://github.com/frouriojs/create-frourio-app/compare/v0.12.2...v0.13.0) (2020-10-07)


### Features

* add frourio-express ([0df8f13](https://github.com/frouriojs/create-frourio-app/commit/0df8f134b5a189adb1eb1072b05caad6077cd292))
* add frourio-fastify ([7dd1b7d](https://github.com/frouriojs/create-frourio-app/commit/7dd1b7d9c95ef6d4a5fd8f92a9bea8fba9bd90d6))

### [0.12.2](https://github.com/frouriojs/create-frourio-app/compare/v0.12.1...v0.12.2) (2020-10-03)


### Bug Fixes

* update frourio@0.14.3 ([a4c8218](https://github.com/frouriojs/create-frourio-app/commit/a4c821886aec0142b9982e396ef98d5d933a97c6))

### [0.12.1](https://github.com/frouriojs/create-frourio-app/compare/v0.12.0...v0.12.1) (2020-10-02)


### Bug Fixes

* sqlite config ([ea3ff79](https://github.com/frouriojs/create-frourio-app/commit/ea3ff79d6bf6345f93d27b266dee55fa1050f85f))

## [0.12.0](https://github.com/frouriojs/create-frourio-app/compare/v0.11.5...v0.12.0) (2020-10-02)


### Features

* add choices of orm ([74a5d8f](https://github.com/frouriojs/create-frourio-app/commit/74a5d8f1333dbb3a4fdc4e340fa29309b5771616))
* add dbHost ([d9bb2c8](https://github.com/frouriojs/create-frourio-app/commit/d9bb2c8cf65f97abcd03a34d026a2241e4ca795d))
* add prisma files ([e77722b](https://github.com/frouriojs/create-frourio-app/commit/e77722b8d2cbde2d89905c10e1d7162dbfd59df0))
* improve ts and webpack config ([bafb7e0](https://github.com/frouriojs/create-frourio-app/commit/bafb7e0e519d6e2239e27df0f90a5bdcdcec9a8f))

### [0.11.5](https://github.com/frouriojs/create-frourio-app/compare/v0.11.4...v0.11.5) (2020-10-01)


### Features

* update frourio@0.14.1 ([1a8aa4a](https://github.com/frouriojs/create-frourio-app/commit/1a8aa4a7723019f05af4e1d84322ddd144a0326e))

### [0.11.4](https://github.com/frouriojs/create-frourio-app/compare/v0.11.3...v0.11.4) (2020-09-30)


### Bug Fixes

* fill db type ([6ba7cd2](https://github.com/frouriojs/create-frourio-app/commit/6ba7cd225ced47213f79a4865743a5ba2e1e78ae))

### [0.11.3](https://github.com/frouriojs/create-frourio-app/compare/v0.11.2...v0.11.3) (2020-09-21)


### Features

* update frourio@0.13.1 ([cf0dc20](https://github.com/frouriojs/create-frourio-app/commit/cf0dc20c9cf0ef335cadb3f9772f46d9f7ce8753))

### [0.11.2](https://github.com/frouriojs/create-frourio-app/compare/v0.11.1...v0.11.2) (2020-09-19)


### Bug Fixes

* use mutate instead of useState ([26dd992](https://github.com/frouriojs/create-frourio-app/commit/26dd9925d96b60eaf3f21b5c043834d1b395c3a3))

### [0.11.1](https://github.com/frouriojs/create-frourio-app/compare/v0.11.0...v0.11.1) (2020-09-19)


### Bug Fixes

* **Next.js:** rename _app.js to _app.tsx ([11e962c](https://github.com/frouriojs/create-frourio-app/commit/11e962c3ab710594111e8ac0514fe10f7f2397be))

## [0.11.0](https://github.com/frouriojs/create-frourio-app/compare/v0.10.2...v0.11.0) (2020-09-19)


### Features

* **Next.js:** support static HTML export ([856745e](https://github.com/frouriojs/create-frourio-app/commit/856745e38ea9cdf85a373d21cfca2bbb433bd798))

### [0.10.2](https://github.com/frouriojs/create-frourio-app/compare/v0.10.1...v0.10.2) (2020-09-18)


### Bug Fixes

* add build:server command ([ceb2c65](https://github.com/frouriojs/create-frourio-app/commit/ceb2c654ee6ada5cd4de22cffb3be060a4058fb4))

### [0.10.1](https://github.com/frouriojs/create-frourio-app/compare/v0.10.0...v0.10.1) (2020-09-15)


### Bug Fixes

* nuxt-fetch plugin ([f63aa28](https://github.com/frouriojs/create-frourio-app/commit/f63aa28b06e1188fa07db2b97ec379df67cf9f62))

## [0.10.0](https://github.com/frouriojs/create-frourio-app/compare/v0.9.10...v0.10.0) (2020-09-15)


### Features

* update frourio@0.13.0 ([37ba53b](https://github.com/frouriojs/create-frourio-app/commit/37ba53b15ff3a95f8a6ccb1d24f08449907f1b1d))


### Bug Fixes

* bump cac from 6.5.10 to 6.6.1 ([403d1d6](https://github.com/frouriojs/create-frourio-app/commit/403d1d635fe7e579b1f664151cb9854fd59bc853))
* bump envinfo from 7.5.1 to 7.7.2 ([4464cdd](https://github.com/frouriojs/create-frourio-app/commit/4464cddbcf806402c7e01c93973eb163f7eae7a1))


### Documentation

* update README ([6ff51f5](https://github.com/frouriojs/create-frourio-app/commit/6ff51f5a70c20b776d110d7e2830e64d3993999f))

### [0.9.10](https://github.com/frouriojs/create-frourio-app/compare/v0.9.9...v0.9.10) (2020-07-24)


### Bug Fixes

* typecheck command ([b059fc6](https://github.com/frouriojs/create-frourio-app/commit/b059fc63ddede4e4724238c13ddb3cb2aaa0c80f))

### [0.9.9](https://github.com/frouriojs/create-frourio-app/compare/v0.9.8...v0.9.9) (2020-07-22)


### Features

* update frourio@0.11.0 ([5295b61](https://github.com/frouriojs/create-frourio-app/commit/5295b61d1a7337d9b82c2ebbccb80194f866a3df))

### [0.9.8](https://github.com/frouriojs/create-frourio-app/compare/v0.9.7...v0.9.8) (2020-07-18)


### Bug Fixes

* prettier config ([f5276af](https://github.com/frouriojs/create-frourio-app/commit/f5276af6b731ad50cc95c320de541bb212dc4421))

### [0.9.7](https://github.com/frouriojs/create-frourio-app/compare/v0.9.6...v0.9.7) (2020-07-17)


### Chore

* update server modules ([1b2dfba](https://github.com/frouriojs/create-frourio-app/commit/1b2dfbafad6051c9e6c35ee70b1c4ba1e16894c8))

### [0.9.6](https://github.com/frouriojs/create-frourio-app/compare/v0.9.5...v0.9.6) (2020-07-14)


### Bug Fixes

* add .eslintignore ([a68ea3a](https://github.com/frouriojs/create-frourio-app/commit/a68ea3a6f3bd2c8dadc7d7cd3adec1b743977c24))

### [0.9.5](https://github.com/frouriojs/create-frourio-app/compare/v0.9.4...v0.9.5) (2020-07-09)


### Bug Fixes

* typeorm settings ([06ba7e2](https://github.com/frouriojs/create-frourio-app/commit/06ba7e29ffeed75fe9f81a7833be77faaf304009))

### [0.9.4](https://github.com/frouriojs/create-frourio-app/compare/v0.9.3...v0.9.4) (2020-07-08)


### Bug Fixes

* add @types/node to next.js ([c95d62f](https://github.com/frouriojs/create-frourio-app/commit/c95d62fff1e2252f05013e7b61bf50613655b21e))

### [0.9.3](https://github.com/frouriojs/create-frourio-app/compare/v0.9.2...v0.9.3) (2020-07-08)


### Bug Fixes

* setup front building ([17615da](https://github.com/frouriojs/create-frourio-app/commit/17615da478232ea33143f36cb0019db2fd115323))

### [0.9.2](https://github.com/frouriojs/create-frourio-app/compare/v0.9.1...v0.9.2) (2020-07-07)


### Bug Fixes

* for deploying on docker ([b28fd2c](https://github.com/frouriojs/create-frourio-app/commit/b28fd2c2c54c85cbec6573f4e1adf723a6dfdf2c))

### [0.9.1](https://github.com/frouriojs/create-frourio-app/compare/v0.9.0...v0.9.1) (2020-07-04)


### Features

* disable Nuxt telemetry ([923a6c5](https://github.com/frouriojs/create-frourio-app/commit/923a6c51e8f37e56153e375a3f0a1bc9b411670e))


### Bug Fixes

* bump chalk from 4.0.0 to 4.1.0 ([93e6e2a](https://github.com/frouriojs/create-frourio-app/commit/93e6e2a039f059c8d6ebb6ce84836b68674f907b))

## [0.9.0](https://github.com/frouriojs/create-frourio-app/compare/v0.8.0...v0.9.0) (2020-06-29)


### Features

* **next:** separate package.json ([26466d1](https://github.com/frouriojs/create-frourio-app/commit/26466d1c377fb9d76cba8ccbd25c2b10a50ff991))
* **none:** separate package.json ([2e688e2](https://github.com/frouriojs/create-frourio-app/commit/2e688e27299e26877874f6a9f4b95199e31caefa))
* **nuxt:** separate package.json ([99863fb](https://github.com/frouriojs/create-frourio-app/commit/99863fb9d647e1d35c9019e8ebad7f572dbf043d))
* **nuxt:** update 2.13.0 ([834e3c4](https://github.com/frouriojs/create-frourio-app/commit/834e3c4b3abac44db13a22b1fa5e3b22906649b6))
* update frourio@0.10.2 ([cbb049a](https://github.com/frouriojs/create-frourio-app/commit/cbb049af4b061dc6431e1236c102032ccb2a38be))


### Bug Fixes

* pm2 package.json ([eaaf9f2](https://github.com/frouriojs/create-frourio-app/commit/eaaf9f2c0e4eb7108e03d1d14e08a51e186052f2))
* pm2.config.json ([b0b204a](https://github.com/frouriojs/create-frourio-app/commit/b0b204aae2ac7e8875704d96af0dc4d81486d455))

## [0.8.0](https://github.com/frouriojs/create-frourio-app/compare/v0.7.2...v0.8.0) (2020-06-18)


### Features

* choose HTTP client ([4f6f73e](https://github.com/frouriojs/create-frourio-app/commit/4f6f73e3e6f1cf9adf1b47ded4acb22113b258df))

### [0.7.2](https://github.com/frouriojs/create-frourio-app/compare/v0.7.1...v0.7.2) (2020-06-16)


### Bug Fixes

* default of frontend ([0f70c7d](https://github.com/frouriojs/create-frourio-app/commit/0f70c7d3d7a0dcc95d66454326535a4c6aaf85a9))

### [0.7.1](https://github.com/frouriojs/create-frourio-app/compare/v0.7.0...v0.7.1) (2020-06-16)


### Bug Fixes

* lint and fw name ([e53f0df](https://github.com/frouriojs/create-frourio-app/commit/e53f0df6bf7ea31b48b15e0f2fb17461ec9bf42e))

## [0.7.0](https://github.com/frouriojs/create-frourio-app/compare/v0.6.0...v0.7.0) (2020-06-16)


### Features

* update frourio@0.10.0 ([f3b4160](https://github.com/frouriojs/create-frourio-app/commit/f3b41601c17d98229c9fb7c2dab127fa29884a76))

## [0.6.0](https://github.com/frouriojs/create-frourio-app/compare/v0.5.0...v0.6.0) (2020-06-15)


### Features

* update frourio@0.9.0 ([33cde4e](https://github.com/frouriojs/create-frourio-app/commit/33cde4e89ef810b5b299eeb643a223dff28aac53))

## [0.5.0](https://github.com/frouriojs/create-frourio-app/compare/v0.4.2...v0.5.0) (2020-06-14)


### Features

* update frourio@0.8.0 ([385a4f5](https://github.com/frouriojs/create-frourio-app/commit/385a4f56d69c31eed0b0c143d02c7c4c050a5f10))

### [0.4.2](https://github.com/frouriojs/create-frourio-app/compare/v0.4.1...v0.4.2) (2020-06-14)


### Bug Fixes

* import File type from frourio ([cea9094](https://github.com/frouriojs/create-frourio-app/commit/cea9094dc86f1211a4e9a29ef9d7681daed34469))

### [0.4.1](https://github.com/frouriojs/create-frourio-app/compare/v0.4.0...v0.4.1) (2020-06-13)


### Bug Fixes

* add login form to nextts ([ec0feb8](https://github.com/frouriojs/create-frourio-app/commit/ec0feb8464261f9e9622fc02a9d8e663e59b52ce))
* move api to server/api ([67267ef](https://github.com/frouriojs/create-frourio-app/commit/67267eff16f9f83f444eff2d10f67018a578b896))

## [0.4.0](https://github.com/frouriojs/create-frourio-app/compare/v0.3.2...v0.4.0) (2020-06-13)


### Features

* add login form ([10e21a0](https://github.com/frouriojs/create-frourio-app/commit/10e21a02b348e977d8746ce338c1d827090095da))

### [0.3.2](https://github.com/frouriojs/create-frourio-app/compare/v0.3.1...v0.3.2) (2020-06-12)


### Bug Fixes

* **nuxt:** update typescript@3.9.5 ([082eb30](https://github.com/frouriojs/create-frourio-app/commit/082eb309ba8456ae09114ef8ad202fb87bfdd972))

### [0.3.1](https://github.com/frouriojs/create-frourio-app/compare/v0.3.0...v0.3.1) (2020-06-12)


### Bug Fixes

* update @nuxt/typescript-build ([412db39](https://github.com/frouriojs/create-frourio-app/commit/412db39054f6b273a0ffb941a914c517ac50acf8))

## [0.3.0](https://github.com/frouriojs/create-frourio-app/compare/v0.2.0...v0.3.0) (2020-06-12)


### Features

* support database ([b45d879](https://github.com/frouriojs/create-frourio-app/commit/b45d879fc97f95e1fc81e5c2e4dac98460f3bb61))
* update frourio@0.6.0 ([c22d939](https://github.com/frouriojs/create-frourio-app/commit/c22d9395db42ec61f5c23b1485276f07f0ad5612))


### Bug Fixes

* add pm2.config.js ([9c0c762](https://github.com/frouriojs/create-frourio-app/commit/9c0c76203787c2bb694855fcaedcce14df33dc39))
* change target es5 to 6 ([08e8dbf](https://github.com/frouriojs/create-frourio-app/commit/08e8dbfb7b3f1ad6b1690671420aac6c3876df61))

## [0.2.0](https://github.com/frouriojs/create-frourio-app/compare/v0.1.2...v0.2.0) (2020-06-10)


### Features

* add frameworks ([14a95b2](https://github.com/frouriojs/create-frourio-app/commit/14a95b21762f2c1c9d124b6c763ba695b66463e8))
* add next.ts ([efdb5ec](https://github.com/frouriojs/create-frourio-app/commit/efdb5ecb26c2a1ec20747aeef3efbe65865bca06))

### [0.1.2](https://github.com/frouriojs/create-frourio-app/compare/v0.1.1...v0.1.2) (2020-06-08)


### Bug Fixes

* templateDir of saofile ([dd09e0b](https://github.com/frouriojs/create-frourio-app/commit/dd09e0b6efc28107877f07560d8ad023b72a8803))

### [0.1.1](https://github.com/frouriojs/create-frourio-app/compare/v0.1.0...v0.1.1) (2020-06-08)


### Bug Fixes

* add templates to files ([7b1ff0f](https://github.com/frouriojs/create-frourio-app/commit/7b1ff0fb322b3b7d9ee16996e4404d35f900e2fc))

## 0.1.0 (2020-06-08)


### Features

* add github actions ([3776d3a](https://github.com/frouriojs/create-frourio-app/commit/3776d3a1aafd3f13a13a63e9a6ccc9b1e8d95d39))
* add nuxt template ([3ddeb8a](https://github.com/frouriojs/create-frourio-app/commit/3ddeb8a8857462df556d408b0ac06d1aecd1a7b3))
* add test ([f619a23](https://github.com/frouriojs/create-frourio-app/commit/f619a23518f3a5dd4af6953597e17914d52433c9))


### Bug Fixes

* update snapshot ([675bbb4](https://github.com/frouriojs/create-frourio-app/commit/675bbb4ca9c9ad7de8ba5c16e079a0d6de95e42a))
