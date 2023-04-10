cmake_minimum_required(VERSION 3.5)

# Define project
project(gba)

############## GBA ##############
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)
set(VBA_NEXT_DIR ./vba-next)
set(VBA_WSM_DIR ./vba-wsm)

add_definitions(-DUSE_KEYBOARD -DFRONTEND_SUPPORTS_RGB565 -DHAVE_STDINT_H -DINLINE=inline -DLSB_FIRST -DUSE_STATIC_WRAM -DUSE_CHEATS=1)

add_executable(vba-wsm
    ${VBA_WSM_DIR}/main.cpp
    ${VBA_WSM_DIR}/ui.h
    ${VBA_NEXT_DIR}/src/gba.cpp
    ${VBA_NEXT_DIR}/src/memory.cpp
    ${VBA_NEXT_DIR}/src/sound.cpp
    ${VBA_NEXT_DIR}/src/system.cpp
    ${VBA_NEXT_DIR}/libretro/libretro.cpp
)

target_compile_options(vba-wsm PRIVATE -flto -O3)

target_include_directories(vba-wsm PRIVATE
    ${VBA_NEXT_DIR}/src ${VBA_NEXT_DIR}/libretro ${VBA_NEXT_DIR}/libretro-common/include
    ${SDL2_INCLUDE_DIRS}
)

target_link_libraries(vba-wsm PRIVATE
    ${SDL2_LIBRARIES}
)

target_link_options(vba-wsm PRIVATE -flto -O3 --emit-symbol-map -sEXPORTED_FUNCTIONS=['_emuGetSymbol','_main','_emuRunFrame','_emuSetSampleRate','_emuLoadROM','_emuResetCpu','_emuAddCheat']  -sEXPORT_ALL=1 -sTOTAL_MEMORY=134217728 -sLLD_REPORT_UNDEFINED)

############## Svelte ##############
# Find npm
find_program(NPM npm)
if (NOT NPM)
    message(FATAL_ERROR "npm not found")
endif()

# Install npm dependencies
execute_process(
    COMMAND ${NPM} i
    WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}
)

# Build svelte app
add_custom_target(
    svelte ALL
    COMMAND ${NPM} run build
    WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}
)

# Move wasm to svelte app
add_custom_command(
    TARGET vba-wsm POST_BUILD
    COMMAND ${CMAKE_COMMAND} -E copy_if_different
        ${CMAKE_CURRENT_BINARY_DIR}/vba-wsm.wasm
        ${CMAKE_CURRENT_BINARY_DIR}/vba-wsm.js
        ${CMAKE_CURRENT_BINARY_DIR}/vba-wsm.js.symbols
        ${CMAKE_CURRENT_SOURCE_DIR}/public
)

add_dependencies(svelte vba-wsm)