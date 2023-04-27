FROM emscripten/emsdk:3.1.37 as build
COPY . /src
WORKDIR /src

RUN emcmake cmake -B ./build -DCMAKE_BUILD_TYPE=Release \
    && emmake cmake --build ./build --config Release

FROM jitesoft/lighttpd:latest
EXPOSE 80
COPY --from=build /src/dist /var/www/html
CMD ["lighttpd", "-D", "-f", "/etc/lighttpd/lighttpd.conf"]