const demo = axios.create({
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json; charset=UTF-8',
  },
})

demo.interceptors.response.use(function (response) {
  return response.data.code ? Promise.resolve(response) : Promise.reject(response)
})

demo.interceptors.response.use(null, function (response) {
  if (response.config.url === '/api/c') {
    console.log('skip for /api/c')
    return
  }
  if (response.config.retry) {
    console.log('skip for retry')
    return
  }
  console.log('please login', response.config.url)
  return new Promise(function (resolve, reject) {

    if (demo.auth) {
      // 如果是已授权的，需要标记为未授权
      demo.auth = 0
    }

    function retry () {
      response.config.retry = true
      demo.request(response.config).then(function (inner_response) {
        resolve(inner_response)
      }, function (response) {
        reject(response)
      })
    }

    if (!demo.reAuth) {
      // 如果还没有请求发起重新认证。就发起一个重新认证的请求
      demo.reAuth = demo.post('/api/c').finally(function () {
        // 在重新请求认证结束后，不管成功还是失败，都清空这个请求
        demo.reAuth = null
      })
    }

    demo.reAuth.then(function () {
      // 重新登录成功
      retry()
    }, function () {
      // 重新登录失败
      reject(response)
    })
  })
})

demo.post('/api/a').then(function (response) {
  console.log('a', 'success', response)
}).catch(function (error) {
  console.log('a', 'fail', error)
})

demo.post('/api/b', {
  params: {
    ID: 12345,
  },
}).then(function (response) {
  console.log('b', 'success', response)
}).catch(function (error) {
  console.log('b', 'fail', error)
})
