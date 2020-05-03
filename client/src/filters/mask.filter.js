export  function mask(value,type,show) {
  switch (type) {
    case 'email':
      if (show.em) {
        return value
      }
     return value.replace(/(?<=^[A-Za-z0-9]{2}).*?(?=@)/g, function(gp1, gp2) {
      for(let i = 0; i < gp1.length; i++) { 
        gp2+= "*"; 
      }
       return gp2; 
    })

    case 'phone':
      if (show.ph) {
        return value
      }
      return value.toString().slice(0,4)+"*****" + value.toString().slice(-2)

    case 'password':
      if (show.pw) {
        return value
      }
      return new Array(value.length).fill('*').join('')
    default:
      return value
  }
}
