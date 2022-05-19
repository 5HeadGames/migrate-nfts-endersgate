import hre, {network, ethers} from "hardhat";
import axios from "axios";
import {writeJsonFile, loadJsonFile, uploadIpfs} from "../utils/index";
import {EndersGate} from "../types";
import {attach} from "../utils/contracts";

//data snapshot
const {erc1155Tokens} = {
  data: {
    erc1155Tokens: [
      {
        balances: [
          {
            account: {
              id: "0x030eb0849964d125772155e252982f7e9cbf32e4",
            },
            value: "-0.000000000000000001",
          },
          {
            account: {
              id: "0x0ab9d474f51f0e501451bb73f67d80580506c3e0",
            },
            value: "0",
          },
          {
            account: {
              id: "0x0bf01a1e21c5853fd627b27f6af9ff9a4fde7976",
            },
            value: "-0.000000000000000001",
          },
          {
            account: {
              id: "0x0c804a85bde69a6c83de624b381746e393f9777a",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x0cfbcc70fdb7b963cd15d4b36ee0985e9e241168",
            },
            value: "-0.000000000000000001",
          },
          {
            account: {
              id: "0x0dcd5287b93c5933c9dbb81022c79cd6a0ade095",
            },
            value: "-0.000000000000000001",
          },
          {
            account: {
              id: "0x0fd1d04b6ede979be56dc6680d1433718245eb72",
            },
            value: "-0.000000000000000001",
          },
          {
            account: {
              id: "0x119e9181c3e8fdaa97a06fd4896356d09ca67e33",
            },
            value: "-0.000000000000000001",
          },
          {
            account: {
              id: "0x13b3f7c5f9c0084bc50fdd621afe1a7c5176e830",
            },
            value: "-0.000000000000000001",
          },
          {
            account: {
              id: "0x151095948d217801b88b6c6deddfce8a401500b8",
            },
            value: "-0.000000000000000001",
          },
          {
            account: {
              id: "0x15f34324ff4ec68ae359d03c4d43d52dbd0dbb31",
            },
            value: "-0.000000000000000002",
          },
          {
            account: {
              id: "0x162997defa3f6db5a1fd1100224a841f0f19fe93",
            },
            value: "-0.000000000000000001",
          },
          {
            account: {
              id: "0x1bde6b0885011f718108b51f9f6c19ad16b2de97",
            },
            value: "0",
          },
          {
            account: {
              id: "0x21f72e6095f619323ed8c74dbcdd4d8bdef6e5d6",
            },
            value: "-0.000000000000000002",
          },
          {
            account: {
              id: "0x223f1763f15a3061908d05b241eaa82ae5c048cb",
            },
            value: "-0.000000000000000001",
          },
          {
            account: {
              id: "0x244edc485c2725fbaf3463c9bd63b1d60f6ad86c",
            },
            value: "-0.000000000000000004",
          },
          {
            account: {
              id: "0x257f138198e6a730b89fd4fe56a69836eb854ac3",
            },
            value: "0.000000000000000002",
          },
          {
            account: {
              id: "0x26ae7659c43c4e5d01999429976d063ee9e94478",
            },
            value: "-0.000000000000000001",
          },
          {
            account: {
              id: "0x2af1f8c41f9693c728720d774436d398b03f8288",
            },
            value: "-0.000000000000000002",
          },
          {
            account: {
              id: "0x2bf98dbf38546ebcc7e5e4b8aca7572a567bd13e",
            },
            value: "-0.000000000000000002",
          },
          {
            account: {
              id: "0x2d1f8e9bfb75a6350fb0fe20402b183269fb9387",
            },
            value: "0",
          },
          {
            account: {
              id: "0x2d2e638299bc57b90a93a46c10de2d6cf0c90690",
            },
            value: "-0.000000000000000001",
          },
          {
            account: {
              id: "0x2e71074a2076baf76028f8f3fda40a51a8aaff06",
            },
            value: "0",
          },
          {
            account: {
              id: "0x32dd7aea8f9e4871f22dc1310d4acfa264cd0c47",
            },
            value: "-0.000000000000000003",
          },
          {
            account: {
              id: "0x341d89d4bda044e91d8f6b0e5ecc4fbd53fe20a0",
            },
            value: "-0.000000000000000001",
          },
          {
            account: {
              id: "0x3729a8e24c060ab28dbc38375316e3693db7c51b",
            },
            value: "-0.000000000000000001",
          },
          {
            account: {
              id: "0x3c1feaa02e6dcf76acad161bf1297f2d0763da0f",
            },
            value: "-0.000000000000000001",
          },
          {
            account: {
              id: "0x3c9525855b12a5175c7387c2df0e771ac9f96b4f",
            },
            value: "-0.00000000000000002",
          },
          {
            account: {
              id: "0x3d24e3116a13379c1ef114ff4381477387715588",
            },
            value: "-0.000000000000000002",
          },
          {
            account: {
              id: "0x3d41cf1d1976f6ba30975e0b15c1c637b640131e",
            },
            value: "-0.000000000000000001",
          },
          {
            account: {
              id: "0x3df9df6eb462e7d276f0bbdf468f47a72e240d8b",
            },
            value: "-0.000000000000000001",
          },
          {
            account: {
              id: "0x3e193c7dde6877f8719f6cbd4978546f70c834d3",
            },
            value: "-0.000000000000000001",
          },
          {
            account: {
              id: "0x42220f1bc103ab1c805cb3fcc8eb93c345c4a438",
            },
            value: "-0.000000000000000001",
          },
          {
            account: {
              id: "0x44cb584bfb2486595e574f9be58c62d2bcbfd8d0",
            },
            value: "-0.000000000000000001",
          },
          {
            account: {
              id: "0x4900d62465100ec25e7480ca31da2f3f634ba58d",
            },
            value: "-0.000000000000000001",
          },
          {
            account: {
              id: "0x4c36d7c23defc1187126ec97f2481bbe518646a8",
            },
            value: "-0.000000000000000003",
          },
          {
            account: {
              id: "0x509dcc51971b5b77b91585553f3e7c2527c92460",
            },
            value: "-0.000000000000000002",
          },
          {
            account: {
              id: "0x513a36ad32552a8939697d12a342f8ecb124bd61",
            },
            value: "0",
          },
          {
            account: {
              id: "0x52c540a125096b9eb5daba9ed6fc5e0910240be1",
            },
            value: "-0.000000000000000001",
          },
          {
            account: {
              id: "0x53c12e707c0e71780820ac5526b2f47ba4fd7f68",
            },
            value: "-0.000000000000000001",
          },
          {
            account: {
              id: "0x53e015c2ac7e638b9ac5115f8ccba8d20bbf4368",
            },
            value: "-0.000000000000000001",
          },
          {
            account: {
              id: "0x5476e6d01f17f6df25fee285f025428734f524f9",
            },
            value: "-0.000000000000000001",
          },
          {
            account: {
              id: "0x54b84cfab0ac7c9edc01d22b77cd061301de05db",
            },
            value: "-0.000000000000000001",
          },
          {
            account: {
              id: "0x578df3844ebfcc38782b3fa53f0bc70011143cc9",
            },
            value: "0",
          },
          {
            account: {
              id: "0x5b2af2593cf8b6467886ace88d53b3dec5384c56",
            },
            value: "0",
          },
          {
            account: {
              id: "0x5c57c52856d6d9cc8678ad3b6b52267221ec5e4f",
            },
            value: "-0.000000000000000001",
          },
          {
            account: {
              id: "0x5c78ee7c3053ddd370e11ac53844d3e339868fb7",
            },
            value: "-0.000000000000000001",
          },
          {
            account: {
              id: "0x5d6dcd1aa88e2b5442bd46d8f9f351b2127ee049",
            },
            value: "0.000000000000000188",
          },
          {
            account: {
              id: "0x60a7e44fb3dd425dcc8d03b5f1c4089159182411",
            },
            value: "-0.000000000000000001",
          },
          {
            account: {
              id: "0x6618af3fe00c0ec3de8cf3e62d65ef4e01d11759",
            },
            value: "-0.000000000000000002",
          },
          {
            account: {
              id: "0x69cb9ac1eaf23b6ea23fd1a8bd578da94b97fcaa",
            },
            value: "-0.000000000000000001",
          },
          {
            account: {
              id: "0x6d2c09e1690cae8c2004593b9126fb66aa1dbb18",
            },
            value: "-0.000000000000000002",
          },
          {
            account: {
              id: "0x7254f61b0cdce636fa98b0f34bb36690f4fa10bf",
            },
            value: "-0.000000000000000003",
          },
          {
            account: {
              id: "0x72a8b76ed7438273df309b3a9fa126d2df3840b6",
            },
            value: "-0.000000000000000016",
          },
          {
            account: {
              id: "0x79d860858361577a4f2a33d83aac2299b6d77025",
            },
            value: "-0.000000000000000001",
          },
          {
            account: {
              id: "0x7b2dab1a4fb170f179056bd8452f4df08e755403",
            },
            value: "-0.000000000000000002",
          },
          {
            account: {
              id: "0x7d6cfd9c6aa17f35a9b6e3c295ab21324df841b6",
            },
            value: "-0.000000000000000001",
          },
          {
            account: {
              id: "0x7ed5c65f4f2a7275a116526337180f9a0de5952b",
            },
            value: "-0.000000000000000005",
          },
          {
            account: {
              id: "0x7f9d8e5ba371d82e997b70ea9e3a0498c1576387",
            },
            value: "0",
          },
          {
            account: {
              id: "0x807fb3dca069266c6afd5bcdc35d821d3d0ca16e",
            },
            value: "-0.000000000000000001",
          },
          {
            account: {
              id: "0x8260fbc198bf4d0fef645bbd058651face93e14f",
            },
            value: "-0.000000000000000001",
          },
          {
            account: {
              id: "0x85ca40b9a4f2b26755c41a4770c79b0996ca94ae",
            },
            value: "-0.000000000000000001",
          },
          {
            account: {
              id: "0x87da0336a5fd528f6c06ec02c6523122bc6133db",
            },
            value: "-0.000000000000000001",
          },
          {
            account: {
              id: "0x8ab1336e91319ffeaf9933be0a198390d5d57831",
            },
            value: "0",
          },
          {
            account: {
              id: "0x8c359924bbd1e649e67a83be8a09c09c9e9c6cb2",
            },
            value: "-0.000000000000000001",
          },
          {
            account: {
              id: "0x8d73ddd2ef4f00b97377570a9a558ac7ff14dde3",
            },
            value: "0",
          },
          {
            account: {
              id: "0x8e7935f88b08ffa9cbb2c0dedffb454bd2480312",
            },
            value: "-0.000000000000000001",
          },
          {
            account: {
              id: "0x8ed02d151814bb701a5d125ae39cb7e5e2ce6f1f",
            },
            value: "-0.000000000000000001",
          },
          {
            account: {
              id: "0x91053799373aa3af832e84f5c64e90128f1eb7ad",
            },
            value: "-0.000000000000000001",
          },
          {
            account: {
              id: "0x928f07ecb3c923f6197fd537dbd8abb579fccf52",
            },
            value: "-0.000000000000000001",
          },
          {
            account: {
              id: "0x936ecd13d2acc9c45bec00111964dda2b6ee9ac7",
            },
            value: "-0.000000000000000002",
          },
          {
            account: {
              id: "0x969f2f8d84e73d5306d0f5d6871c58255da2867d",
            },
            value: "-0.000000000000000001",
          },
          {
            account: {
              id: "0x97065154a6ce176bd3006ad7db01e8fdeff8e713",
            },
            value: "-0.000000000000000002",
          },
          {
            account: {
              id: "0x976df602916ac2ee8c3fbc377732174cfec75282",
            },
            value: "-0.000000000000000002",
          },
          {
            account: {
              id: "0x97cdcf6efa699878e40cd7e4f485ac8cfa6c9b83",
            },
            value: "-0.000000000000000001",
          },
          {
            account: {
              id: "0x97fce2ddfb2876b0d27bcdd7087c6d5eb37eb5d9",
            },
            value: "-0.000000000000000001",
          },
          {
            account: {
              id: "0x982b186982ec0fee1ff58355a7efb6002782e8a9",
            },
            value: "-0.000000000000000008",
          },
          {
            account: {
              id: "0x9970e4f02a6c07ebc7659d913be2bfaa225a0dc3",
            },
            value: "0",
          },
          {
            account: {
              id: "0x9b691884f23459dafc92985cbb4dcbe22b39cdb8",
            },
            value: "-0.000000000000000001",
          },
          {
            account: {
              id: "0x9b7917f95bbe817b84547e26c5e55450935b5ae2",
            },
            value: "-0.000000000000000002",
          },
          {
            account: {
              id: "0x9cc62019a2f314e76da198e7dcfe681a5ea66cce",
            },
            value: "-0.000000000000000001",
          },
          {
            account: {
              id: "0x9d6d4f946319abd76f3249fae0631eb123c743af",
            },
            value: "-0.000000000000000001",
          },
          {
            account: {
              id: "0xa3724907c29cb13faca01eca69cc5ead42269517",
            },
            value: "-0.000000000000000001",
          },
          {
            account: {
              id: "0xa6b1f2ec82c33791235f655efb4fe0e715245b6b",
            },
            value: "-0.000000000000000002",
          },
          {
            account: {
              id: "0xa6e1096715afe0b132052e0589a980cfd378f133",
            },
            value: "-0.000000000000000001",
          },
          {
            account: {
              id: "0xa6f1c95d8d069b894ef506e15e4ae9ddf065a39f",
            },
            value: "-0.000000000000000001",
          },
          {
            account: {
              id: "0xa919f9ad0e6d6ca5789b85743c923bab449ba82c",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0xb352dd67cccc101a8b8bbdf5916f766296718efd",
            },
            value: "-0.000000000000000001",
          },
          {
            account: {
              id: "0xb4e7419a42ea01c418998fcc1df2ac0788e97566",
            },
            value: "-0.000000000000000001",
          },
          {
            account: {
              id: "0xb59965147da87119cbdcfdee1d04304381cc6ec5",
            },
            value: "-0.000000000000000002",
          },
          {
            account: {
              id: "0xb738cbb316df8a5b1575d8a14980ac69333dc1d3",
            },
            value: "0",
          },
          {
            account: {
              id: "0xb7ca0de915234ba820f2654bd1b6466bf60c3c51",
            },
            value: "0",
          },
          {
            account: {
              id: "0xbaea8f436728c246d469c46cf59cfc7d60f1b880",
            },
            value: "-0.000000000000000002",
          },
          {
            account: {
              id: "0xbd1df00dd7021b1c21e44140150f5f5c5d800fbc",
            },
            value: "-0.000000000000000001",
          },
          {
            account: {
              id: "0xbdba5f0e233be83a507b6626d955e2b171c8f920",
            },
            value: "-0.000000000000000001",
          },
          {
            account: {
              id: "0xc1e4155e505910f9c1018f677a49c4a3a6787519",
            },
            value: "-0.000000000000000001",
          },
          {
            account: {
              id: "0xc1f116a699222112d560e5e2ee28b5e2e174e699",
            },
            value: "-0.000000000000000001",
          },
          {
            account: {
              id: "0xc254a04fed809deac24fec6bf74871996c4df86b",
            },
            value: "0",
          },
          {
            account: {
              id: "0xc40cbf37430cf0c9eaa66eed35e57ca2e327a0fe",
            },
            value: "-0.000000000000000005",
          },
          {
            account: {
              id: "0xc4a9ef47d12e34cb42251eccb3635505be0d96b4",
            },
            value: "-0.000000000000000002",
          },
        ],
        id: "0x51be175fa7a56b98bcffa124d6bd31480b093214/0x1",
      },
      {
        balances: [
          {
            account: {
              id: "0x0ab9d474f51f0e501451bb73f67d80580506c3e0",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x0bf01a1e21c5853fd627b27f6af9ff9a4fde7976",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x0dcd5287b93c5933c9dbb81022c79cd6a0ade095",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x0fd1d04b6ede979be56dc6680d1433718245eb72",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x119e9181c3e8fdaa97a06fd4896356d09ca67e33",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x151095948d217801b88b6c6deddfce8a401500b8",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x15f34324ff4ec68ae359d03c4d43d52dbd0dbb31",
            },
            value: "0.000000000000000002",
          },
          {
            account: {
              id: "0x162997defa3f6db5a1fd1100224a841f0f19fe93",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x1bde6b0885011f718108b51f9f6c19ad16b2de97",
            },
            value: "0.000000000000000009",
          },
          {
            account: {
              id: "0x21f72e6095f619323ed8c74dbcdd4d8bdef6e5d6",
            },
            value: "0.000000000000000003",
          },
          {
            account: {
              id: "0x223f1763f15a3061908d05b241eaa82ae5c048cb",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x244edc485c2725fbaf3463c9bd63b1d60f6ad86c",
            },
            value: "0.000000000000000004",
          },
          {
            account: {
              id: "0x26ae7659c43c4e5d01999429976d063ee9e94478",
            },
            value: "0",
          },
          {
            account: {
              id: "0x2af1f8c41f9693c728720d774436d398b03f8288",
            },
            value: "0",
          },
          {
            account: {
              id: "0x2bf98dbf38546ebcc7e5e4b8aca7572a567bd13e",
            },
            value: "0.000000000000000002",
          },
          {
            account: {
              id: "0x2d1f8e9bfb75a6350fb0fe20402b183269fb9387",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x2d2e638299bc57b90a93a46c10de2d6cf0c90690",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x2e71074a2076baf76028f8f3fda40a51a8aaff06",
            },
            value: "0.000000000000000002",
          },
          {
            account: {
              id: "0x32dd7aea8f9e4871f22dc1310d4acfa264cd0c47",
            },
            value: "0.000000000000000003",
          },
          {
            account: {
              id: "0x341d89d4bda044e91d8f6b0e5ecc4fbd53fe20a0",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x3729a8e24c060ab28dbc38375316e3693db7c51b",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x3c1feaa02e6dcf76acad161bf1297f2d0763da0f",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x3c9525855b12a5175c7387c2df0e771ac9f96b4f",
            },
            value: "0.00000000000000002",
          },
          {
            account: {
              id: "0x3d24e3116a13379c1ef114ff4381477387715588",
            },
            value: "0",
          },
          {
            account: {
              id: "0x3df9df6eb462e7d276f0bbdf468f47a72e240d8b",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x3e193c7dde6877f8719f6cbd4978546f70c834d3",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x42220f1bc103ab1c805cb3fcc8eb93c345c4a438",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x44cb584bfb2486595e574f9be58c62d2bcbfd8d0",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x4900d62465100ec25e7480ca31da2f3f634ba58d",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x4c36d7c23defc1187126ec97f2481bbe518646a8",
            },
            value: "0.000000000000000003",
          },
          {
            account: {
              id: "0x509dcc51971b5b77b91585553f3e7c2527c92460",
            },
            value: "0.000000000000000002",
          },
          {
            account: {
              id: "0x513a36ad32552a8939697d12a342f8ecb124bd61",
            },
            value: "0.000000000000000003",
          },
          {
            account: {
              id: "0x52c540a125096b9eb5daba9ed6fc5e0910240be1",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x53c12e707c0e71780820ac5526b2f47ba4fd7f68",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x53e015c2ac7e638b9ac5115f8ccba8d20bbf4368",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x54b84cfab0ac7c9edc01d22b77cd061301de05db",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x578df3844ebfcc38782b3fa53f0bc70011143cc9",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x5b2af2593cf8b6467886ace88d53b3dec5384c56",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x5c78ee7c3053ddd370e11ac53844d3e339868fb7",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x6618af3fe00c0ec3de8cf3e62d65ef4e01d11759",
            },
            value: "0.000000000000000002",
          },
          {
            account: {
              id: "0x69cb9ac1eaf23b6ea23fd1a8bd578da94b97fcaa",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x6d2c09e1690cae8c2004593b9126fb66aa1dbb18",
            },
            value: "0.000000000000000002",
          },
          {
            account: {
              id: "0x6f8a3fd8a6883237ee3e7436eb0fac1399fc69b5",
            },
            value: "0.000000000000000002",
          },
          {
            account: {
              id: "0x7254f61b0cdce636fa98b0f34bb36690f4fa10bf",
            },
            value: "0.000000000000000003",
          },
          {
            account: {
              id: "0x72a8b76ed7438273df309b3a9fa126d2df3840b6",
            },
            value: "0.000000000000000003",
          },
          {
            account: {
              id: "0x79d860858361577a4f2a33d83aac2299b6d77025",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x7b2dab1a4fb170f179056bd8452f4df08e755403",
            },
            value: "0.000000000000000002",
          },
          {
            account: {
              id: "0x7d6cfd9c6aa17f35a9b6e3c295ab21324df841b6",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x7ed5c65f4f2a7275a116526337180f9a0de5952b",
            },
            value: "0.000000000000000005",
          },
          {
            account: {
              id: "0x7f9d8e5ba371d82e997b70ea9e3a0498c1576387",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x807fb3dca069266c6afd5bcdc35d821d3d0ca16e",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x8260fbc198bf4d0fef645bbd058651face93e14f",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x85ca40b9a4f2b26755c41a4770c79b0996ca94ae",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x87da0336a5fd528f6c06ec02c6523122bc6133db",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x8d73ddd2ef4f00b97377570a9a558ac7ff14dde3",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x8ed02d151814bb701a5d125ae39cb7e5e2ce6f1f",
            },
            value: "0",
          },
          {
            account: {
              id: "0x91053799373aa3af832e84f5c64e90128f1eb7ad",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x928f07ecb3c923f6197fd537dbd8abb579fccf52",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x936ecd13d2acc9c45bec00111964dda2b6ee9ac7",
            },
            value: "0.000000000000000002",
          },
          {
            account: {
              id: "0x969f2f8d84e73d5306d0f5d6871c58255da2867d",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x97065154a6ce176bd3006ad7db01e8fdeff8e713",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x976df602916ac2ee8c3fbc377732174cfec75282",
            },
            value: "0.000000000000000002",
          },
          {
            account: {
              id: "0x97cdcf6efa699878e40cd7e4f485ac8cfa6c9b83",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x982b186982ec0fee1ff58355a7efb6002782e8a9",
            },
            value: "0.000000000000000006",
          },
          {
            account: {
              id: "0x9b7917f95bbe817b84547e26c5e55450935b5ae2",
            },
            value: "0.000000000000000002",
          },
          {
            account: {
              id: "0x9cc62019a2f314e76da198e7dcfe681a5ea66cce",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x9d6d4f946319abd76f3249fae0631eb123c743af",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0xa6b1f2ec82c33791235f655efb4fe0e715245b6b",
            },
            value: "0.000000000000000002",
          },
          {
            account: {
              id: "0xa6e1096715afe0b132052e0589a980cfd378f133",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0xa6f1c95d8d069b894ef506e15e4ae9ddf065a39f",
            },
            value: "0",
          },
          {
            account: {
              id: "0xae414077fdaef7ce46ed2fd47fa30eca0527a0b5",
            },
            value: "0.000000000000000009",
          },
          {
            account: {
              id: "0xb352dd67cccc101a8b8bbdf5916f766296718efd",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0xb4e7419a42ea01c418998fcc1df2ac0788e97566",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0xb59965147da87119cbdcfdee1d04304381cc6ec5",
            },
            value: "0.000000000000000002",
          },
          {
            account: {
              id: "0xb7ca0de915234ba820f2654bd1b6466bf60c3c51",
            },
            value: "0.000000000000000002",
          },
          {
            account: {
              id: "0xbaea8f436728c246d469c46cf59cfc7d60f1b880",
            },
            value: "0.000000000000000002",
          },
          {
            account: {
              id: "0xbd1df00dd7021b1c21e44140150f5f5c5d800fbc",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0xbdba5f0e233be83a507b6626d955e2b171c8f920",
            },
            value: "0",
          },
          {
            account: {
              id: "0xc1e4155e505910f9c1018f677a49c4a3a6787519",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0xc1f116a699222112d560e5e2ee28b5e2e174e699",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0xc254a04fed809deac24fec6bf74871996c4df86b",
            },
            value: "0.000000000000000002",
          },
          {
            account: {
              id: "0xc27a0b50933754ed6b6b66e16e53d6b04a1ede32",
            },
            value: "0.000000000000000002",
          },
          {
            account: {
              id: "0xc40cbf37430cf0c9eaa66eed35e57ca2e327a0fe",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0xc4a9ef47d12e34cb42251eccb3635505be0d96b4",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0xca50c71f0d9d00e7d075b3c72ee7a272e32baaf7",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0xcb329f653898c95fa6616d633132f44c06422c11",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0xd122b6ccaea041ced703b8ecefd132a68c16f999",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0xd5c7a8d0b0dec66c95186a430314b289abe61de2",
            },
            value: "0.000000000000000002",
          },
          {
            account: {
              id: "0xd688042d90ebcf5e65d9e30a63e5455159ca6070",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0xd79959b966f70891064f91c1d86a56c34bff0254",
            },
            value: "0.000000000000000003",
          },
          {
            account: {
              id: "0xd902d059b835cb148ceced9b2becb2c394bb2e67",
            },
            value: "0",
          },
          {
            account: {
              id: "0xd918736286a63e0637a9fa521e60c90a5cc0fda4",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0xdd183581220bd61c9dcca29ccf2a63e1996c0f14",
            },
            value: "0.000000000000000002",
          },
          {
            account: {
              id: "0xdffae50260a79d24188de7cd177453285779c609",
            },
            value: "0",
          },
          {
            account: {
              id: "0xe12b2a8fcf67aee28deafcb8908e4179d770fd11",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0xe26743e5800d9fd3507f69596acc96e2e92c4500",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0xe2c66e42d932ddd8097ed5b6960fd6d18fe5aa04",
            },
            value: "0.000000000000000004",
          },
          {
            account: {
              id: "0xe7187b303a8b15968fbc3054a7a66cdb3f057ff2",
            },
            value: "0.000000000000000002",
          },
          {
            account: {
              id: "0xf0b52a4c20061f736f1d18acc60c01da0db4306b",
            },
            value: "0.000000000000000002",
          },
          {
            account: {
              id: "0xf1669bf2fbf4a8702a54404d459e98137c7514ea",
            },
            value: "0.000000000000000001",
          },
        ],
        id: "0xad6f94bdefb6d5ae941392da5224ed083ae33adc/0xd7",
      },
      {
        balances: [
          {
            account: {
              id: "0x02a0176f54c4028f9d3175fd3331751a29c4ed01",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x04068e69c09c0422997af8cc9adb68272840248d",
            },
            value: "0.00000000000000001",
          },
          {
            account: {
              id: "0x064d875e4f384b5b1204f8af98737c6f90da34e8",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x0830fa19d7ed016fe63398cb6f073472e1c02564",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x0ae58404bc8e968fee4ec6fa7375c1887c9ed5eb",
            },
            value: "0.000000000000000002",
          },
          {
            account: {
              id: "0x0b14e4ec1c1b92878b6d23cd74fbfd98875ad51b",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x0b86c97f60ae5a0d442de0aadf36cdf7e61b30d6",
            },
            value: "0.000000000000000004",
          },
          {
            account: {
              id: "0x0bf01a1e21c5853fd627b27f6af9ff9a4fde7976",
            },
            value: "0.00000000000000001",
          },
          {
            account: {
              id: "0x0dcd5287b93c5933c9dbb81022c79cd6a0ade095",
            },
            value: "0.000000000000000002",
          },
          {
            account: {
              id: "0x0fd1d04b6ede979be56dc6680d1433718245eb72",
            },
            value: "0.000000000000000002",
          },
          {
            account: {
              id: "0x109168b7adcc68105700cf7413dc5166f6add1d2",
            },
            value: "0.000000000000000003",
          },
          {
            account: {
              id: "0x15f34324ff4ec68ae359d03c4d43d52dbd0dbb31",
            },
            value: "0.000000000000000002",
          },
          {
            account: {
              id: "0x162997defa3f6db5a1fd1100224a841f0f19fe93",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x192001e212ea9dfe2eadf22550a58d45c603136e",
            },
            value: "0",
          },
          {
            account: {
              id: "0x1bde6b0885011f718108b51f9f6c19ad16b2de97",
            },
            value: "0.000000000000000032",
          },
          {
            account: {
              id: "0x1cb5b20fb1b9010d1332c707526f957b6cc1a0f8",
            },
            value: "0.000000000000000002",
          },
          {
            account: {
              id: "0x21f72e6095f619323ed8c74dbcdd4d8bdef6e5d6",
            },
            value: "0.000000000000000003",
          },
          {
            account: {
              id: "0x24437f22bc7ee46dbd9fedf73ed5934f71d118b5",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x244edc485c2725fbaf3463c9bd63b1d60f6ad86c",
            },
            value: "0.00000000000000001",
          },
          {
            account: {
              id: "0x267089e545addb96556a1981769242b11fb2bd66",
            },
            value: "0.000000000000000004",
          },
          {
            account: {
              id: "0x26ae7659c43c4e5d01999429976d063ee9e94478",
            },
            value: "0",
          },
          {
            account: {
              id: "0x26fe9fb0c02b1d26e7618cba63f53a2c9e0df9cb",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x2af1f8c41f9693c728720d774436d398b03f8288",
            },
            value: "0",
          },
          {
            account: {
              id: "0x2b4ea7e64fae040f7b491e62c88ffbb0306ccb5f",
            },
            value: "0.000000000000000002",
          },
          {
            account: {
              id: "0x2bf98dbf38546ebcc7e5e4b8aca7572a567bd13e",
            },
            value: "0.000000000000000002",
          },
          {
            account: {
              id: "0x2c24c8accde4a4b9ea393ddae1ba11813a3a6865",
            },
            value: "0.000000000000000002",
          },
          {
            account: {
              id: "0x2c562bf4f6058905cce5c0abff30fd3fcfc3e01f",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x2d1f8e9bfb75a6350fb0fe20402b183269fb9387",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x2d2e638299bc57b90a93a46c10de2d6cf0c90690",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x2e71074a2076baf76028f8f3fda40a51a8aaff06",
            },
            value: "0.000000000000000007",
          },
          {
            account: {
              id: "0x2eafd5f044a5d7811b45e48cc59c8953403595fb",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x2f83a4afce1901c9392f0c0d250f50d372a1fb21",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x2ff2b1375881f0ab441536d4ef95ee986bf38dad",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x3216e724d10db80a158fe0cd664f2bd6a9e3ac58",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x32dd7aea8f9e4871f22dc1310d4acfa264cd0c47",
            },
            value: "0.000000000000000003",
          },
          {
            account: {
              id: "0x341d89d4bda044e91d8f6b0e5ecc4fbd53fe20a0",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x34e32bd8c570fda2f11ede2c49bc68b0d0b3877b",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x3563b96e40a6f0a951146a7c1f5eb2c8eeecc7c5",
            },
            value: "0.000000000000000004",
          },
          {
            account: {
              id: "0x370eb5580c6b34286891c03e9caa4f194557d71b",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x38032f326436fdb9c7a9b359e90010f86b8ab482",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x3a4bc25b2c4549e571ae1dcc42ca29fd8c4f6590",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x3c1feaa02e6dcf76acad161bf1297f2d0763da0f",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x3caec1b35c38fde81b58f4beef61472daf3b8f68",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x3cc485a9fb97d421c062e6c45bf0e061dc411bf1",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x3d24e3116a13379c1ef114ff4381477387715588",
            },
            value: "0",
          },
          {
            account: {
              id: "0x3e193c7dde6877f8719f6cbd4978546f70c834d3",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x3fac33e04a1aad3e7f00ec680e0f499d20c0bb63",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x4036429776a5aab91f3bf1d63a8c68dcb9c67108",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x442b140bafef953b24e1833b6e40a4563d4572e4",
            },
            value: "0.000000000000000002",
          },
          {
            account: {
              id: "0x44cb584bfb2486595e574f9be58c62d2bcbfd8d0",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x44e7aed14d523baa5bcc812c63de6586b24c3ab9",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x4596c452716f02b0fd726e286ad5ea9f1f2bcdd8",
            },
            value: "0.000000000000000002",
          },
          {
            account: {
              id: "0x46040a3307d719c4a738f99fd9810143f3afec01",
            },
            value: "0",
          },
          {
            account: {
              id: "0x4618d3c1d51c4e5afa73b50924614ff5fce89467",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x47ba37dd0a0c89e01cb312411c29b6034a91c729",
            },
            value: "0.000000000000000002",
          },
          {
            account: {
              id: "0x483290fa9a0c18f63868b623714acfc9305196f2",
            },
            value: "0.000000000000000003",
          },
          {
            account: {
              id: "0x4900d62465100ec25e7480ca31da2f3f634ba58d",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x4c36d7c23defc1187126ec97f2481bbe518646a8",
            },
            value: "0.00000000000000001",
          },
          {
            account: {
              id: "0x4c8592d4349fdb81684be240e74e292d0e64cfa1",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x51009e12818d1379054f47848f930fa88fb78129",
            },
            value: "0.000000000000000003",
          },
          {
            account: {
              id: "0x513a36ad32552a8939697d12a342f8ecb124bd61",
            },
            value: "0.000000000000000004",
          },
          {
            account: {
              id: "0x52c540a125096b9eb5daba9ed6fc5e0910240be1",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x53bcb0922028d91148128173f79a74938b6591b3",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x53c12e707c0e71780820ac5526b2f47ba4fd7f68",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x53e015c2ac7e638b9ac5115f8ccba8d20bbf4368",
            },
            value: "0.000000000000000002",
          },
          {
            account: {
              id: "0x54b84cfab0ac7c9edc01d22b77cd061301de05db",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x578df3844ebfcc38782b3fa53f0bc70011143cc9",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x5a8355eb8baa39e282250d52a8db10fc65831a8e",
            },
            value: "0.000000000000000003",
          },
          {
            account: {
              id: "0x5b2af2593cf8b6467886ace88d53b3dec5384c56",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x5baa9ca23f3e267dc469e91e5a39cd40e7c02e8b",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x5c57c52856d6d9cc8678ad3b6b52267221ec5e4f",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x5c78ee7c3053ddd370e11ac53844d3e339868fb7",
            },
            value: "0.000000000000000002",
          },
          {
            account: {
              id: "0x6458abb800c1835db625d00f0a3a7b6c3727216a",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x651b4fdba6239d7481099cd32a803b263a5c150a",
            },
            value: "0.000000000000000002",
          },
          {
            account: {
              id: "0x655552b438d13027bd46dee323f301b37ab56c36",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x6618af3fe00c0ec3de8cf3e62d65ef4e01d11759",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x665d047fa597b4f447a4fb9887eaeba4189dede1",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x69cb9ac1eaf23b6ea23fd1a8bd578da94b97fcaa",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x6a185e756d60cc20dc35054955a7e51c9cb76a5f",
            },
            value: "0",
          },
          {
            account: {
              id: "0x6bc7394da4b629ef9d13c713548be7e821c3d937",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x6c87cbe6f5b85a463a52d0251aeea2209300416b",
            },
            value: "0.000000000000000004",
          },
          {
            account: {
              id: "0x6c9c692fbfef68dbb1efc51738e16afbc2fee5b9",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x6d2c09e1690cae8c2004593b9126fb66aa1dbb18",
            },
            value: "0.000000000000000002",
          },
          {
            account: {
              id: "0x6f8a3fd8a6883237ee3e7436eb0fac1399fc69b5",
            },
            value: "0.000000000000000002",
          },
          {
            account: {
              id: "0x72a8b76ed7438273df309b3a9fa126d2df3840b6",
            },
            value: "0.00000000000000001",
          },
          {
            account: {
              id: "0x72dd3d8fae1ce0d369d4a368b054682e923e679c",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x72e0876eb52087e571aa64f9b5b8b29bce04599d",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x7471f9440ab5fe580a06b483c0f850586da7f9a8",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x7740cc89a83dd38998f2ac2d91eb892006860b58",
            },
            value: "0.000000000000000003",
          },
          {
            account: {
              id: "0x78fb79d58cbf6f0462e346cf24ed5f3a1b8c6d23",
            },
            value: "0",
          },
          {
            account: {
              id: "0x79d860858361577a4f2a33d83aac2299b6d77025",
            },
            value: "0.000000000000000002",
          },
          {
            account: {
              id: "0x7a0373a8789562dd3923d3c212e249e5e88723cf",
            },
            value: "0.000000000000000002",
          },
          {
            account: {
              id: "0x7b2dab1a4fb170f179056bd8452f4df08e755403",
            },
            value: "0.000000000000000004",
          },
          {
            account: {
              id: "0x7d6cfd9c6aa17f35a9b6e3c295ab21324df841b6",
            },
            value: "0.000000000000000004",
          },
          {
            account: {
              id: "0x7db9b3cdd5039a9bc102ff4c7280992c9b8f2993",
            },
            value: "0.000000000000000004",
          },
          {
            account: {
              id: "0x7e3d993a8d63c25d1db5f7ff8a8d6c59091003b1",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x7ed5c65f4f2a7275a116526337180f9a0de5952b",
            },
            value: "0.000000000000000007",
          },
          {
            account: {
              id: "0x7f0d3db00e9d2df027d240dfc4536122a17774e7",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x7f4a0b031d4621a5f12c211bc4b1038b855d34df",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x7f9d8e5ba371d82e997b70ea9e3a0498c1576387",
            },
            value: "0.00000000000000002",
          },
        ],
        id: "0xad6f94bdefb6d5ae941392da5224ed083ae33adc/0xe6",
      },
      {
        balances: [
          {
            account: {
              id: "0x000000000000000000000000000000000000dead",
            },
            value: "0.00000000000000214",
          },
          {
            account: {
              id: "0x00d3be15cc9a9d071b6810531fbac7938c50ac39",
            },
            value: "0.000000000000000002",
          },
          {
            account: {
              id: "0x0106d24d66e7b7973f495213d35d60a1e53d8cb9",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x0162295a8690ba499aa34deb38d50f8dd95c0dcd",
            },
            value: "0.000000000000000002",
          },
          {
            account: {
              id: "0x02a0176f54c4028f9d3175fd3331751a29c4ed01",
            },
            value: "0",
          },
          {
            account: {
              id: "0x02f7d4a989dc50aae5ee89f3e435199bdf4695d6",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x04068e69c09c0422997af8cc9adb68272840248d",
            },
            value: "0",
          },
          {
            account: {
              id: "0x05067949930b24331f4b26f54f4d0447a69f135c",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x0515b7819a045aeb797e984acb0d05cdafa98d35",
            },
            value: "0.000000000000000003",
          },
          {
            account: {
              id: "0x064d875e4f384b5b1204f8af98737c6f90da34e8",
            },
            value: "0",
          },
          {
            account: {
              id: "0x0830fa19d7ed016fe63398cb6f073472e1c02564",
            },
            value: "0",
          },
          {
            account: {
              id: "0x08536482fde0caddef1c1f558e1d02b1c7b9e3f7",
            },
            value: "0",
          },
          {
            account: {
              id: "0x085f42f20b35c6c24e4c64e105b10490c75f6b56",
            },
            value: "0.000000000000000002",
          },
          {
            account: {
              id: "0x092e4cf1c4de7c2c78e58edd964f1dd9daecf3c6",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x09f31f5953564dcf7824a8fe48e4a3d532c785f7",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x0ae58404bc8e968fee4ec6fa7375c1887c9ed5eb",
            },
            value: "0",
          },
          {
            account: {
              id: "0x0b14e4ec1c1b92878b6d23cd74fbfd98875ad51b",
            },
            value: "0",
          },
          {
            account: {
              id: "0x0b2b3170d9c4246136e9155a2c9656a08037caae",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x0b5a8bbf49bf91072568c60f5037d332c4a16a74",
            },
            value: "0.000000000000000002",
          },
          {
            account: {
              id: "0x0b5cb9aa44950611834bbef290edeb919365b0fd",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x0b86c97f60ae5a0d442de0aadf36cdf7e61b30d6",
            },
            value: "0",
          },
          {
            account: {
              id: "0x0bf01a1e21c5853fd627b27f6af9ff9a4fde7976",
            },
            value: "0",
          },
          {
            account: {
              id: "0x0ccebbb258c22224b6f046a2be9c488e25ab5bc0",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x0d31cb017573b8398b283b068ce7cf53c3de6d60",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x0dcd5287b93c5933c9dbb81022c79cd6a0ade095",
            },
            value: "0",
          },
          {
            account: {
              id: "0x0fd1d04b6ede979be56dc6680d1433718245eb72",
            },
            value: "0",
          },
          {
            account: {
              id: "0x0fd472cc84320039fdb2eba3f093f0839bc06598",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x109168b7adcc68105700cf7413dc5166f6add1d2",
            },
            value: "0",
          },
          {
            account: {
              id: "0x109ab019db1e2a45bf2b9017bb96c0946e27c978",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x13a7fe5d341b47559a975564841aa5266fd8aa88",
            },
            value: "0.000000000000000009",
          },
          {
            account: {
              id: "0x15f34324ff4ec68ae359d03c4d43d52dbd0dbb31",
            },
            value: "0",
          },
          {
            account: {
              id: "0x162997defa3f6db5a1fd1100224a841f0f19fe93",
            },
            value: "0",
          },
          {
            account: {
              id: "0x169e5d4959db02bb980a7ad2d0bcc25e5ed32f6b",
            },
            value: "0.000000000000000006",
          },
          {
            account: {
              id: "0x16d234c95d142488b35ed4ac3340305efcf3fae3",
            },
            value: "0.000000000000000002",
          },
          {
            account: {
              id: "0x176c450d1d704403756d7e57b5de286ea63efa93",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x18640ff950187c5dfd4fab3148545b53d1e4fd57",
            },
            value: "0",
          },
          {
            account: {
              id: "0x192001e212ea9dfe2eadf22550a58d45c603136e",
            },
            value: "0",
          },
          {
            account: {
              id: "0x1a39a2d4145068d97a13ba3be93edf936c66e116",
            },
            value: "0.000000000000000026",
          },
          {
            account: {
              id: "0x1bde6b0885011f718108b51f9f6c19ad16b2de97",
            },
            value: "0",
          },
          {
            account: {
              id: "0x1cb5b20fb1b9010d1332c707526f957b6cc1a0f8",
            },
            value: "0",
          },
          {
            account: {
              id: "0x1d9329f4d69daf9e323177abe998cbde5063aa2e",
            },
            value: "0.000000000000000003",
          },
          {
            account: {
              id: "0x1e295f213bfe9a19ce0545801b4a2334d189bc9b",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x1e8e480702c8342b5cc7415c398dc46ca79921da",
            },
            value: "0.000000000000000002",
          },
          {
            account: {
              id: "0x1f59468ffc6a9cd7a4aea0ad15bf52afef189054",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x1fa2aa04da074c39d912a74451b75b6db8ab89b5",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x202276908b38e6e7056b92215c87a912a814361a",
            },
            value: "0",
          },
          {
            account: {
              id: "0x20a235a60f8747cea99c7486024329e97fcc5bd3",
            },
            value: "0.000000000000000002",
          },
          {
            account: {
              id: "0x20c696b204adc48714eaedbe95a905c54a75efaa",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x21f72e6095f619323ed8c74dbcdd4d8bdef6e5d6",
            },
            value: "0",
          },
          {
            account: {
              id: "0x22afddaa8853c47142f90c030e01ea3244b26cf9",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x2362c40fd281b3ba18531f067a5c313ee44096d4",
            },
            value: "0.000000000000000004",
          },
          {
            account: {
              id: "0x2398f45acf29596b3bff6abae273dc1c4623f89a",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x24437f22bc7ee46dbd9fedf73ed5934f71d118b5",
            },
            value: "0",
          },
          {
            account: {
              id: "0x244edc485c2725fbaf3463c9bd63b1d60f6ad86c",
            },
            value: "0",
          },
          {
            account: {
              id: "0x2496cc41214fb447103feb117a219aced261cd83",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x2530cce60b99968875e9b7d1fa5c54ff1a984489",
            },
            value: "0",
          },
          {
            account: {
              id: "0x257f138198e6a730b89fd4fe56a69836eb854ac3",
            },
            value: "0.000000000000000004",
          },
          {
            account: {
              id: "0x267089e545addb96556a1981769242b11fb2bd66",
            },
            value: "0",
          },
          {
            account: {
              id: "0x26ae7659c43c4e5d01999429976d063ee9e94478",
            },
            value: "0",
          },
          {
            account: {
              id: "0x26fe9fb0c02b1d26e7618cba63f53a2c9e0df9cb",
            },
            value: "0",
          },
          {
            account: {
              id: "0x270b7ba730b5f17135c003a396994e790396fcb6",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x274fdd8a24fcb08185af98662c0a8ba6fc9dfde6",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x288549cfa97698a43020fe8785c8143dbec2b822",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x29b6fe6efce2e6fde416dbb9451ae7677f8b3166",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x2a23ee4d575499ec9ac58dcfd3960c5d3f1f0d3b",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x2abbcf208a2307a753bf7fce0dbfbcd58893e255",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x2af1f8c41f9693c728720d774436d398b03f8288",
            },
            value: "0",
          },
          {
            account: {
              id: "0x2b4ea7e64fae040f7b491e62c88ffbb0306ccb5f",
            },
            value: "0",
          },
          {
            account: {
              id: "0x2bf1b922076edeb4307f1b3db1469bd91c8967b7",
            },
            value: "0.000000000000000004",
          },
          {
            account: {
              id: "0x2bf98dbf38546ebcc7e5e4b8aca7572a567bd13e",
            },
            value: "0",
          },
          {
            account: {
              id: "0x2c24c8accde4a4b9ea393ddae1ba11813a3a6865",
            },
            value: "0",
          },
          {
            account: {
              id: "0x2c562bf4f6058905cce5c0abff30fd3fcfc3e01f",
            },
            value: "0",
          },
          {
            account: {
              id: "0x2c996fd139a16909ab5a2435a6c43d6d0103c86a",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x2d1f8e9bfb75a6350fb0fe20402b183269fb9387",
            },
            value: "0",
          },
          {
            account: {
              id: "0x2d2e638299bc57b90a93a46c10de2d6cf0c90690",
            },
            value: "0",
          },
          {
            account: {
              id: "0x2d5a17539943a8c1a753578af3b4f91c9eb85eb9",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x2e71074a2076baf76028f8f3fda40a51a8aaff06",
            },
            value: "0",
          },
          {
            account: {
              id: "0x2eafd5f044a5d7811b45e48cc59c8953403595fb",
            },
            value: "0",
          },
          {
            account: {
              id: "0x2f83a4afce1901c9392f0c0d250f50d372a1fb21",
            },
            value: "0",
          },
          {
            account: {
              id: "0x2ff2b1375881f0ab441536d4ef95ee986bf38dad",
            },
            value: "0",
          },
          {
            account: {
              id: "0x3071fc556fcb0200d2e0274f197ad0449f2a7d0b",
            },
            value: "0.000000000000000002",
          },
          {
            account: {
              id: "0x315df15bcbea81c10fb2c544ad526a51b86685dc",
            },
            value: "0",
          },
          {
            account: {
              id: "0x3196947bbedd926c3c0dfcf2a4c0781ee71cec6e",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x31b64c39cdd084e0e62fc7e0d4d81a7e8d0d404a",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x31b87a9636dc5626a9c1b9aa730cbd17158d701f",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x321172eb0930b5b69bc675b41ce034c08690bc86",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x3216e724d10db80a158fe0cd664f2bd6a9e3ac58",
            },
            value: "0",
          },
          {
            account: {
              id: "0x32dd7aea8f9e4871f22dc1310d4acfa264cd0c47",
            },
            value: "0",
          },
          {
            account: {
              id: "0x335ac0c3b85c194f1c46854f02a1cfdd860b278b",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x341d89d4bda044e91d8f6b0e5ecc4fbd53fe20a0",
            },
            value: "0",
          },
          {
            account: {
              id: "0x34a8584c6494ce5f6a60f004c5053063cc5d79fe",
            },
            value: "0.000000000000000003",
          },
          {
            account: {
              id: "0x34e32bd8c570fda2f11ede2c49bc68b0d0b3877b",
            },
            value: "0",
          },
          {
            account: {
              id: "0x3563b96e40a6f0a951146a7c1f5eb2c8eeecc7c5",
            },
            value: "0",
          },
          {
            account: {
              id: "0x370eb5580c6b34286891c03e9caa4f194557d71b",
            },
            value: "0",
          },
          {
            account: {
              id: "0x38032f326436fdb9c7a9b359e90010f86b8ab482",
            },
            value: "0",
          },
          {
            account: {
              id: "0x3a0ae37d60bf0182a4de64f39ae0906ad0b6a1dc",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x3a4bc25b2c4549e571ae1dcc42ca29fd8c4f6590",
            },
            value: "0",
          },
          {
            account: {
              id: "0x3aa492e6df87987a70e92285b366f443fb6f59d3",
            },
            value: "0.000000000000000001",
          },
          {
            account: {
              id: "0x3c1feaa02e6dcf76acad161bf1297f2d0763da0f",
            },
            value: "0",
          },
          {
            account: {
              id: "0x3caec1b35c38fde81b58f4beef61472daf3b8f68",
            },
            value: "0",
          },
        ],
        id: "0xe1c04284652be3771d514e5f05f823b35075d70f/0x1",
      },
    ],
  },
}.data;

const getHoldersAmounts = async (
  contract: EndersGate,
  balances: {account: {id: string}}[],
  token: number
) => {
  let holdersAmount: {account: string; balance: unknown}[] = [];
  for (let i of balances) {
    const balance = await contract.balanceOf(i.account.id, token);
    if (Number(balance) > 0)
      holdersAmount.push({account: i.account.id, balance: balance.toNumber()});
  }
  return holdersAmount;
};

async function main(): Promise<void> {
  const fileName = "holders.json";
  const fileData = loadJsonFile(`addresses.${network.name}.json`);

  const endersGate = <EndersGate>await attach(hre, "EndersGate", fileData.endersGate);
  const dracul = <EndersGate>await attach(hre, "EndersGate", fileData.dracul);
  const eross = <EndersGate>await attach(hre, "EndersGate", fileData.eross);

  const draculHolders = await getHoldersAmounts(dracul, erc1155Tokens[0].balances, 1);
  console.log("draculHolders");
  const endersDraculHolders = await getHoldersAmounts(endersGate, erc1155Tokens[1].balances, 215);
  console.log("endersDraculHolders ");
  const endersErossHolders = await getHoldersAmounts(endersGate, erc1155Tokens[2].balances, 230);
  console.log("endersErossHolders ");
  const erossHolders = await getHoldersAmounts(eross, erc1155Tokens[3].balances, 1);
  console.log("erossHolders ");

  writeJsonFile({
    path: `/${fileName}`,
    data: {
      eross: endersErossHolders.concat(erossHolders),
      dracul: endersDraculHolders.concat(draculHolders),
    },
  });
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
