describe('router.parseUrl(url, pathType)', function() {
  var router = document.createElement('app-router');

  it('should parse a regular path when pathType="auto"', function() {
    expect(router.parseUrl('http://domain.com/example/path', 'auto')).toEqual({
      path: '/example/path',
      hash: '',
      search: '',
      isHashPath: false,
      hashPathPrefix: ''
    });
  });

  it('should parse a regular path and search when pathType="auto"', function() {
    expect(router.parseUrl('http://domain.com/example/path?queryParam=true', 'auto')).toEqual({
      path: '/example/path',
      hash: '',
      search: '?queryParam=true',
      isHashPath: false,
      hashPathPrefix: ''
    });
  });

  it('should use the regular path on a url with a hash not starting in #/ when pathType="auto"', function() {
    expect(router.parseUrl('http://domain.com/example/path#hash', 'auto')).toEqual({
      path: '/example/path',
      hash: '#hash',
      search: '',
      isHashPath: false,
      hashPathPrefix: ''
    });
  });

  it('should parse a hash path when pathType="auto"', function() {
    expect(router.parseUrl('http://domain.com/#/example/path', 'auto')).toEqual({
      path: '/example/path',
      hash: '#/example/path',
      search: '',
      isHashPath: true,
      hashPathPrefix: ''
    });
  });

  it('should parse the search on a hash path', function() {
    expect(router.parseUrl('http://domain.com/#/example/path?queryParam=true', 'auto')).toEqual({
      path: '/example/path',
      hash: '#/example/path?queryParam=true',
      search: '?queryParam=true',
      isHashPath: true,
      hashPathPrefix: ''
    });
  });

  it('should parse a hashbang path when pathType="auto"', function() {
    expect(router.parseUrl('http://domain.com/#!/example/path?queryParam=true', 'auto')).toEqual({
      path: '/example/path',
      hash: '#!/example/path?queryParam=true',
      search: '?queryParam=true',
      isHashPath: true,
      hashPathPrefix: '!'
    });
  });

  it('should use the hash path and hash search when there is both a regular path and a hash path and pathType="auto"', function() {
    expect(router.parseUrl('http://domain.com/other/path?queryParam2=false#/example/path?queryParam1=true', 'auto')).toEqual({
      path: '/example/path',
      hash: '#/example/path?queryParam1=true',
      search: '?queryParam1=true',
      isHashPath: true,
      hashPathPrefix: ''
    });
  });

  it('should return the hashbang path when there is both a path and a hashbang path', function() {
    expect(router.parseUrl('http://domain.com/other/path?queryParam2=false#!/example/path?queryParam1=true', 'auto')).toEqual({
      path: '/example/path',
      hash: '#!/example/path?queryParam1=true',
      search: '?queryParam1=true',
      isHashPath: true,
      hashPathPrefix: '!'
    });
  });

  it('should use the real path when pathType="regular"', function() {
    expect(router.parseUrl('http://domain.com/#/hash/path', 'regular')).toEqual({
      path: '/',
      hash: '#/hash/path',
      search: '',
      isHashPath: false,
      hashPathPrefix: ''
    });
    expect(router.parseUrl('http://domain.com/regular/path#/hash/path', 'regular')).toEqual({
      path: '/regular/path',
      hash: '#/hash/path',
      search: '',
      isHashPath: false,
      hashPathPrefix: ''
    });
  });

  it('should use the hash as the path when pathType="hash" even if it doesn\'t start with #/ or #!/', function() {
    expect(router.parseUrl('http://domain.com/regular/path#hash/path', 'hash')).toEqual({
      path: 'hash/path',
      hash: '#hash/path',
      search: '',
      isHashPath: true,
      hashPathPrefix: ''
    });
  });

  it('should not use the regular path when pathType="hash"', function() {
    expect(router.parseUrl('http://domain.com/test/', 'hash')).toEqual({
      path: '/',
      hash: '',
      search: '',
      isHashPath: true,
      hashPathPrefix: ''
    });
    expect(router.parseUrl('http://domain.com/test/index.html', 'hash')).toEqual({
      path: '/',
      hash: '',
      search: '',
      isHashPath: true,
      hashPathPrefix: ''
    });
  });
});

describe('router.testRoute(routePath, urlPath, trailingSlashOption, isRegExp)', function() {
  var router = document.createElement('app-router');

  it('should return true on an exact match', function() {
    expect(router.testRoute('/example/path', '/example/path', 'strict', false)).toEqual(true);
  });

  it('should return true on an exact match of the root path', function() {
    expect(router.testRoute('/', '/', 'strict', false)).toEqual(true);
  });

  it('should return true when matching with a wildcard', function() {
    expect(router.testRoute('/example/*', '/example/path', 'strict', false)).toEqual(true);
  });

  it('should return true when matching with a path argument', function() {
    expect(router.testRoute('/:patharg/path', '/example/path', 'strict', false)).toEqual(true);
  });

  it('should return true when matching on a combination of wildcards and path arguments', function() {
    expect(router.testRoute('/*/:patharg', '/example/path', 'strict', false)).toEqual(true);
  });

  it('should always return true when matching on "*"', function() {
    expect(router.testRoute('*', '/example/path', 'strict', false)).toEqual(true);
  });

  it('should not match when one path has a trailing \'/\' but the other doesn\'t', function() {
    expect(router.testRoute('/example/route/', '/example/route', 'strict', false)).toEqual(false);
  });

  it('should return false if the route path does not have the same number of path segments as the URL path', function() {
    expect(router.testRoute('/example/route/longer', '/example/path', 'strict', false)).toEqual(false);
  });

  it('should ignore trailing slashes if `trailingSlash` is "ignore"', function() {
    expect(router.testRoute('/example/path', '/example/path/', 'ignore', false)).toEqual(true);
    expect(router.testRoute('/example/path/', '/example/path', 'ignore', false)).toEqual(true);
  });

  it('should enforce trailing slashes if `trailingSlash` is "strict" (the default)', function() {
    expect(router.testRoute('/example/path', '/example/path/', 'strict', false)).toEqual(false);
    expect(router.testRoute('/example/path/', '/example/path', 'strict', false)).toEqual(false);
  });

  it('should match when the route path is a matching regular expression', function() {
    expect(router.testRoute('/^\\/\\w+\\/\\d+$/', '/word/123', 'strict', true)).toEqual(true);
  });

  it('should match when the route path is a matching regular expression with the \'i\' option', function() {
    expect(router.testRoute('/^\\/\\w+\\/\\d+$/i', '/word/123', 'strict', true)).toEqual(true);
  });

  it('should not match when the route path is a matching regular expression', function() {
    expect(router.testRoute('/^\\/\\w+\\/\\d+$/i', '/word/non-number', 'strict', true)).toEqual(false);
  });

  it('should not match when the route path regular expression does not start with a slash', function() {
    expect(router.testRoute('^\\/\\w+\\/\\d+$/i', '/word/123', 'strict', true)).toEqual(false);
  });

  it('should not match when the route path regular expression does not end with a slash followed by zero or more options', function() {
    expect(router.testRoute('/^\\/\\w+\\/\\d+$', '/word/123', 'strict', true)).toEqual(false);
  });
});

describe('router.routeArguments(routePath, urlPath, search, isRegExp)', function() {
  var router = document.createElement('app-router');

  it('should parse query parameters', function() {
    var args = router.routeArguments('*', '/example/path', '?stringQueryParam=example%20string&numQueryParam=12.34', false);
    expect(args.stringQueryParam).toEqual('example string');
    expect(args.numQueryParam).toEqual(12.34);
  });

  it('should correctly get a query parameter with an equals sign in the value', function() {
    var args = router.routeArguments('*', '/example/path', '?queryParam=some=text&otherParam=123', false);
    expect(args.queryParam).toEqual('some=text');
  });

  it('should parse string path parameters', function() {
    var args = router.routeArguments('/person/:name', '/person/jon', '?queryParam=true', false);
    expect(args.name).toEqual('jon');
  });

  it('should parse number path parameters', function() {
    var args = router.routeArguments('/customer/:id', '/customer/123', '?queryParam=true', false);
    expect(args.id).toEqual(123);
  });

  it('should not add an empty string value when the search is empty', function() {
    var args = router.routeArguments('*', '/example/path', '', false);
    expect(args.hasOwnProperty('')).toBeFalsy();
  });

  it('should still parse query parameters on regex paths', function() {
    var args = router.routeArguments('/^\\/\\w+\\/\\d+$/i', '/example/123', '?queryParam=correct', true);
    expect(args.queryParam).toEqual('correct');
  });
});

describe('router.typecast(value)', function() {
  var router = document.createElement('app-router');

  it('should leave unescaped strings alone', function() {
    expect(router.typecast('hello world!')).toEqual('hello world!');
  });

  it('should unescape (url decode) strings', function() {
    expect(router.typecast('example%20string')).toEqual('example string');
  });

  it('should convert "true" to `true`', function() {
    expect(router.typecast('true')).toEqual(true);
  });

  it('should convert "false" to `false`', function() {
    expect(router.typecast('false')).toEqual(false);
  });

  it('should convert integers', function() {
    expect(router.typecast('123')).toEqual(123);
  });

  it('should convert numbers with decimal points', function() {
    expect(router.typecast('123.456')).toEqual(123.456);
  });

  it('should not convert an empty string to zero', function() {
    expect(router.typecast('')).toEqual('');
  });

  it('should not convert a number with leading zeros to a number', function() {
    expect(router.typecast('00123')).toEqual('00123');
  });
});
