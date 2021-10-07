export default function getURLParameter(name, queryString = location.search) {
  const search = new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)');
  const matchResult = search.exec(queryString) || [null, ''];

  const value = matchResult[1].replace(/\+/g, '%20');

  if (!value) {
    return null; //Apparently decodeURIComponent(null) returns 'null' as a string.
  }

  return decodeURIComponent(value);
}
