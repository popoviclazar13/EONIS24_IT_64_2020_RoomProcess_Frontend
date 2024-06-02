import { HttpInterceptorFn } from '@angular/common/http';

export const customInterceptor: HttpInterceptorFn = (req, next) => {
  //modifikujemo req posto je to nas zahtev
  if(typeof localStorage !== 'undefined'){ // trazi da se doda ovaj IF, zato sto ne zna sta je lokal storage
    const myToken = localStorage.getItem('angular17token');
    const myUloga = localStorage.getItem('ulogaId');
    const cloneRequest = req.clone({
      setHeaders:{
        Authorization:`Bearer ${myToken}`
      }
    });
    return next(cloneRequest);
  }
  return next(req);

};
