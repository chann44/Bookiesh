import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { DbService } from '../src/db/db.service';
import { CreateUserDto } from '../src/auth/dtos';

const URI = 'http://localhost:3333';

describe('App e2e', () => {
  let app: INestApplication;
  let db: DbService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    db = app.get(DbService);
    db.cleanDb();
    pactum.request.setBaseUrl(URI);
    await app.init();
    await app.listen(3333);
  });

  afterAll(async () => {
    app.close();
  });

  describe('Auth Test', () => {
    const dto: CreateUserDto = {
      email: '44chansw@gmail.com',
      password: 'yesvikash29',
    };
    describe('register', () => {
      it('shoudl thow no email', () => {
        return pactum
          .spec()
          .post(`/auth/register`)
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('shoudl thow no password', () => {
        return pactum
          .spec()
          .post(`/auth/register`)
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('shoudl thow no body', () => {
        return pactum.spec().post(`/auth/register`).expectStatus(400);
      });
      it('shoudl wrong email', () => {
        return pactum
          .spec()
          .post(`/auth/register`)
          .withBody({
            email: '44chansw',
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('shoudl register', () => {
        return pactum
          .spec()
          .post(`/auth/register`)
          .withBody(dto)
          .expectStatus(201);
      });
    });
    describe('login', () => {
      it('shoudl thow no email', () => {
        return pactum
          .spec()
          .post(`/auth/login`)
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('shoudl thow no password', () => {
        return pactum
          .spec()
          .post(`/auth/login`)
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('shoudl thow no body', () => {
        return pactum.spec().post(`/auth/login`).expectStatus(400);
      });
      it('shoudl wrong email', () => {
        return pactum
          .spec()
          .post(`/auth/login`)
          .withBody({
            email: '44chansw',
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw incorrect credentials', () => {
        return pactum
          .spec()
          .post(`/auth/login`)
          .withBody({
            email: '44chans@gmail.com',
            password: dto.password,
          })
          .expectStatus(403);
      });
      it('should throw incorrect credentials', () => {
        return pactum
          .spec()
          .post(`/auth/login`)
          .withBody({
            email: dto.email,
            password: 'PASSWRONG',
          })
          .expectStatus(403);
      });
      it('should login', () => {
        return pactum
          .spec()
          .post(`/auth/login`)
          .withBody(dto)
          .expectStatus(201);
      });
    });
  });

  //   describe('User', () => {
  //     describe('get current user', () => {});
  //     describe('edit user', () => {});
  //   });

  //   describe('Bookmark', () => {
  //     it.todo('hello');
  //     describe('create bookmark', () => []);
  //     describe('get All Bookmarks', () => {});
  //     describe('get bookamrk by id', () => {});
  //     describe('delete bookamrk by id', () => {});
  //   });

  it.todo('should pass');
});
