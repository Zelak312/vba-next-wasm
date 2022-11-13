export class Parser {}
// import { Emulator } from "../utils/emulator";

// const BLOCK_OFFSET = 0x00e000;
// window.test = "";
// const map = new Map();
// map.set(0xa1, "0");
// map.set(0xa2, "1");
// map.set(0xa3, "2");
// map.set(0xa4, "3");
// map.set(0xa5, "4");
// map.set(0xa6, "5");
// map.set(0xa7, "6");
// map.set(0xa8, "7");
// map.set(0xa9, "8");
// map.set(0xaa, "9");
// map.set(0xab, "!");
// map.set(0xac, "?");
// map.set(0xad, ".");
// map.set(0xae, "-");
// map.set(0xaf, "・");
// map.set(0xb0, "...");
// map.set(0xb1, "“");
// map.set(0xb2, "”");
// map.set(0xb3, "‘");
// map.set(0xb4, "’");
// map.set(0xb5, "♂");
// map.set(0xb6, "♀");
// map.set(0xb7, "$");
// map.set(0xb8, ",");
// map.set(0xb9, "×");
// map.set(0xba, "/");
// map.set(0xbb, "A");
// map.set(0xbc, "B");
// map.set(0xbd, "C");
// map.set(0xbe, "D");
// map.set(0xbf, "E");
// map.set(0xc0, "F");
// map.set(0xc1, "G");
// map.set(0xc2, "H");
// map.set(0xc3, "I");
// map.set(0xc4, "J");
// map.set(0xc5, "K");
// map.set(0xc6, "L");
// map.set(0xc7, "M");
// map.set(0xc8, "N");
// map.set(0xc9, "O");
// map.set(0xca, "P");
// map.set(0xcb, "Q");
// map.set(0xcc, "R");
// map.set(0xcd, "S");
// map.set(0xce, "T");
// map.set(0xcf, "U");
// map.set(0xd0, "V");
// map.set(0xd1, "W");
// map.set(0xd2, "X");
// map.set(0xd3, "Y");
// map.set(0xd4, "Z");
// map.set(0xd5, "a");
// map.set(0xd6, "b");
// map.set(0xd7, "c");
// map.set(0xd8, "d");
// map.set(0xd9, "e");
// map.set(0xda, "f");
// map.set(0xdb, "g");
// map.set(0xdc, "h");
// map.set(0xdd, "i");
// map.set(0xde, "j");
// map.set(0xdf, "k");
// map.set(0xe0, "l");
// map.set(0xe1, "m");
// map.set(0xe2, "n");
// map.set(0xe3, "o");
// map.set(0xe4, "p");
// map.set(0xe5, "q");
// map.set(0xe6, "r");
// map.set(0xe7, "s");
// map.set(0xe8, "t");
// map.set(0xe9, "u");
// map.set(0xea, "v");
// map.set(0xeb, "w");
// map.set(0xec, "x");
// map.set(0xed, "y");
// map.set(0xee, "z");

// // make reverse mapping for map
// const reverseMap = new Map();
// for (const [key, value] of map) {
//     reverseMap.set(value, key);
// }

// export class Parser {
//     static parseSave(array: Uint8Array) {
//         const firstBlock = array.slice(0, BLOCK_OFFSET);
//         const secondBlock = array.slice(
//             BLOCK_OFFSET,
//             BLOCK_OFFSET + BLOCK_OFFSET
//         );

//         const firstBlockData = new DataView(firstBlock.buffer);
//         const secondBlockData = new DataView(secondBlock.buffer);

//         const newestBlockData =
//             firstBlockData.getUint32(0x0ffc, true) >
//             secondBlockData.getUint32(0x0ffc, true)
//                 ? firstBlockData
//                 : secondBlockData;

//         let sectionOffset = 0x0ffc + 4;

//         for (let i = 0; i < 14; i++) {
//             const sectionData = new DataView(
//                 newestBlockData.buffer.slice(
//                     sectionOffset * i,
//                     sectionOffset * i + sectionOffset
//                 )
//             );
//             const sectionID = sectionData.getUint8(0x0ff4);

//             if (sectionID == 0) {
//                 const data = new DataView(sectionData.buffer.slice(0, 3884));
//                 const name = new DataView(data.buffer.slice(0, 7));
//                 let realName = "";
//                 for (let i = 0; i < 7; i++) {
//                     const char = name.getUint8(i);
//                     if (char == 0xff) break;
//                     realName += map.get(char);
//                 }

//                 if (window.test != "") {
//                     const nameStuff = [];
//                     for (let i = 0; i < 7; i++) {
//                         nameStuff.push(reverseMap.get(window.test[i]));
//                     }
//                     for (let i = 0; i < 7; i++) {
//                         if (nameStuff[i] == undefined) {
//                             nameStuff[i] = 0xff;
//                         }
//                         name.setUint8(i, nameStuff[i]);
//                         if (name.getUint8(i) != nameStuff[i]) {
//                             console.log("error");
//                         }
//                     }

//                     Emulator.set(
//                         new Uint8Array(name.buffer),
//                         BLOCK_OFFSET + sectionOffset
//                     );
//                 }
//                 console.log(realName);
//             }
//         }
//     }
// }
