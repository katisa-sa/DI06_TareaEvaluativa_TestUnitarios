
import { TestBed } from '@angular/core/testing';
import { GestionApiService } from './gestion-api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RespuestaNoticias } from '../interfaces/interfaces';

describe('GestionApiService', () => {
  //Inicializaremos el servicio
  let service: GestionApiService;
  //Necesitaremos un mock para sustituir el HttpCliente
  let httpMock: HttpTestingController;

  //Habrá que import los modulos necesarios, como por ejemplo para simular HttpClient
  beforeEach(() => {
    TestBed.configureTestingModule({
      //importamos el httpClienteTestingModule (OJO, no importamos httpClient)
      imports:[HttpClientTestingModule],
      //En providers añadilos el servicio que vamos a utilizar
      providers: [GestionApiService]
    });
    //Inyectamos el servicio al TestBed
    service = TestBed.inject(GestionApiService);
    //Inyectamos el httpTestingController al TestBed
    httpMock = TestBed.inject(HttpTestingController);
  });

  //afterEach, verificamos httpMock que no queden respuestas pendientes
  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  //Simulamos sin ejecutar la lógica a ver si podemos llamar al método cargarCategoria
  it("Comprobar si podemos llamar al método cargarCategoria", () => {
    const categoria = 'general';
    spyOn(service, 'cargarCategoria');
    service.cargarCategoria(categoria);
    expect(service.cargarCategoria).toHaveBeenCalled();
  });
  

  //
  it('Debería cargar los datos en el BehaviorSubject correctamente', () => {
    const categoria = 'business';
    
    //Necesitaremos un mock de tipo RespuestasNoticias para simular la respuesta del servidor 
    const mockRespuesta: RespuestaNoticias = {
      status: 'ok',
      totalResults: 2,
      articles: [
        {
          source: {
             id: undefined, 
             name: 'Jalopnik' 
            },
          author: undefined,
          title: "Tesla Sells Off-Lease Cars That Were Supposed To Be Robotaxis",
          description: "Today, we're looking at another crappy scheme by Tesla CEO Elon Musk and how much tariffs are going to cost Japanese automakers.",
          url: "https://www.jalopnik.com/1860565/tesla-sells-off-lease-cars-robotaxis/",
          urlToImage: "https://www.jalopnik.com/img/gallery/tesla-sells-off-lease-cars-that-were-supposed-to-be-robotaxis/l-intro-1747318095.jpg",
          publishedAt: "2025-05-15T14:10:07Z",
          content: "From 2019 to the end of 2024, Tesla had a very strange policy in place saying that customers who leased their vehicles weren't allowed to buy them at the end. They had to return the cars to Tesla. CE… [+2822 chars]"
        },
        {
          source: {
            id: undefined,
            name: "Biztoc.com"
            },
          author: undefined,
          title: "Meet the Supercharged Auto Stock That's a Better Buy Than Tesla",
          description: "In This Article:\nKey Points\n-\nTesla shares trade at an alarmingly steep valuation even as the business itself faces challenges.\n-\nYet, one luxury carmaker continues to put up strong results during an uncertain economic period.\n-\nShares of Ferrari aren't cheap…",
          url: "https://biztoc.com/x/512a264aa7c4b840",
          urlToImage: "https://biztoc.com/cdn/512a264aa7c4b840_s.webp",
          publishedAt: "2025-05-15T14:09:34Z",
          content: "In This Article:Key Points-Tesla shares trade at an alarmingly steep valuation even as the business itself faces challenges.-Yet, one luxury carmaker continues to put up strong results during an unce… [+142 chars]"
        }
      ]
    };
    //Ejecutamos la lógica de cargarCategoria para testear que el BehaviorSuject funciona correctamente
    service.cargarCategoria(categoria);
    //Simulamos una llamada API y esperamos una respuesta y que sea de tipo GET
    //Recordar que hacemos uso de HttpTestingController, no de httpClient, por tanto, estamos simulando la llamada API.


//Necesitaremos apiKey de cada uno. 
    //IMPORTANTE MODIFICAR EL APIKEY EN LA CARPETA ENVIRONMENTS
    const req = httpMock.expectOne('https://newsapi.org/v2/top-headlines?country=us&category=${categoria}&apiKey=${service.apiKey}');
    //Simulamos que la respuesta del servidor sea nuestro mockResponse (flush)
    req.flush(mockRespuesta);
    //datos$ tendría que modificarse con los datos simulados (categoria=business y totalResults=2), por tanto data contendrá esos datos.
    //Aquí habrá que hacer el subscribe de datos$, y comprobaremos que data esté definido y que data.categoria y data.totalResults son iguales a nuestra categoria y totalResults
    service.datos$.subscribe(data => {
      expect(data).toBeDefined();
      expect(data?.categoria).toEqual(categoria);
      expect(data?.totalResults).toEqual(mockRespuesta.totalResults);
    });  
  });
});
