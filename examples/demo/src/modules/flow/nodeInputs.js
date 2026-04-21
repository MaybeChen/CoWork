export const NODE_INPUTS = {
  log: `{
  "result": {
    "logResult": [],
    "ciInfo": {
      "ciName": "模型服务千问实例",
      "ciId": "14537ad8-df06-4fb9-a584-e3a30b80b877",
      "ciType": "InferenceModelInstance",
      "ciSubType": "InferenceModelInstance"
    }
  }
}`,
  alert: '222',
  ticket: '333',
  metric: '444',
  topology: `{
  "result": {
    "summary": "已为你识别到 23 个点，55 条边，拓扑关系生成如下：",
    "vertexes": [
      {
        "ciDisplayName": "智慧装维工作号智能体",
        "ciName": "智慧装维工作号智能体",
        "cmdbId": "ac371e92-bc52-4ea9-8368-76bc51643992",
        "ciType": "Application",
        "ciSubType": "Application"
      },
      {
        "ciDisplayName": "模型服务千问实例",
        "ciName": "模型服务千问实例",
        "cmdbId": "14537ad8-df06-4fb9-a584-e3a30b80b877",
        "ciType": "InferenceModelInstance",
        "ciSubType": "InferenceModelInstance"
      },
      {
        "ciDisplayName": "NPU4(A2-IT301-I06-26U-TS-A924-088)",
        "ciName": "NPU4(A2-IT301-I06-26U-TS-A924-088)",
        "cmdbId": "548ae1df-984a-4230-874f-1a0b009d4e9d",
        "ciType": "NPU",
        "ciSubType": "NPU"
      },
      {
        "ciDisplayName": "NPU6(A2-IT301-I06-26U-TS-A924-089)",
        "ciName": "NPU6(A2-IT301-I06-26U-TS-A924-089)",
        "cmdbId": "80033788-d959-4d5b-badc-be974e2ae782",
        "ciType": "NPU",
        "ciSubType": "NPU"
      },
      {
        "ciDisplayName": "NPU8(A2-IT301-I06-26U-TS-A924-088)",
        "ciName": "NPU8(A2-IT301-I06-26U-TS-A924-088)",
        "cmdbId": "4d152341-e4bc-4757-bb24-d8e5b7607f47",
        "ciType": "NPU",
        "ciSubType": "NPU"
      },
      {
        "ciDisplayName": "NPU3(A2-IT301-I06-26U-TS-A924-088)",
        "ciName": "NPU3(A2-IT301-I06-26U-TS-A924-088)",
        "cmdbId": "90456ce2-1830-4b3f-8d08-46341d99cb74",
        "ciType": "NPU",
        "ciSubType": "NPU"
      },
      {
        "ciDisplayName": "NPU7(A2-IT301-I06-26U-TS-A924-089)",
        "ciName": "NPU7(A2-IT301-I06-26U-TS-A924-089)",
        "cmdbId": "2ef9cd84-71f5-49ea-943b-9c22c2ce9832",
        "ciType": "NPU",
        "ciSubType": "NPU"
      },
      {
        "ciDisplayName": "NPU5(A2-IT301-I06-26U-TS-A924-088)",
        "ciName": "NPU5(A2-IT301-I06-26U-TS-A924-088)",
        "cmdbId": "425f2a75-f3fc-4fde-9aeb-f7276fd2f89a",
        "ciType": "NPU",
        "ciSubType": "NPU"
      },
      {
        "ciDisplayName": "NPU8(A2-IT301-I06-26U-TS-A924-089)",
        "ciName": "NPU8(A2-IT301-I06-26U-TS-A924-089)",
        "cmdbId": "d23a2412-7262-4703-8669-510734129c56",
        "ciType": "NPU",
        "ciSubType": "NPU"
      },
      {
        "ciDisplayName": "NPU6(A2-IT301-I06-26U-TS-A924-088)",
        "ciName": "NPU6(A2-IT301-I06-26U-TS-A924-088)",
        "cmdbId": "288d764a-a988-485c-b307-2165caf40648",
        "ciType": "NPU",
        "ciSubType": "NPU"
      },
      {
        "ciDisplayName": "NPU1(A2-IT301-I06-26U-TS-A924-088)",
        "ciName": "NPU1(A2-IT301-I06-26U-TS-A924-088)",
        "cmdbId": "303fe5ff-987b-48eb-91cd-d36e5fcb2eba",
        "ciType": "NPU",
        "ciSubType": "NPU"
      },
      {
        "ciDisplayName": "NPU2(A2-IT301-I06-26U-TS-A924-088)",
        "ciName": "NPU2(A2-IT301-I06-26U-TS-A924-088)",
        "cmdbId": "655065ae-3096-4d32-8f8b-d7621a2f8833",
        "ciType": "NPU",
        "ciSubType": "NPU"
      },
      {
        "ciDisplayName": "NPU3(A2-IT301-I06-26U-TS-A924-089)",
        "ciName": "NPU3(A2-IT301-I06-26U-TS-A924-089)",
        "cmdbId": "f9cd6845-8517-4c76-858f-624279969ea6",
        "ciType": "NPU",
        "ciSubType": "NPU"
      },
      {
        "ciDisplayName": "NPU1(A2-IT301-I06-26U-TS-A924-089)",
        "ciName": "NPU1(A2-IT301-I06-26U-TS-A924-089)",
        "cmdbId": "b050783c-cae3-4933-ad77-9f437a0f6d85",
        "ciType": "NPU",
        "ciSubType": "NPU"
      },
      {
        "ciDisplayName": "NPU7(A2-IT301-I06-26U-TS-A924-088)",
        "ciName": "NPU7(A2-IT301-I06-26U-TS-A924-088)",
        "cmdbId": "0092755d-b006-4fab-8558-270d3e956325",
        "ciType": "NPU",
        "ciSubType": "NPU"
      },
      {
        "ciDisplayName": "NPU2(A2-IT301-I06-26U-TS-A924-089)",
        "ciName": "NPU2(A2-IT301-I06-26U-TS-A924-089)",
        "cmdbId": "de7156fa-0a2b-464b-a7b5-86ac0149a3a6",
        "ciType": "NPU",
        "ciSubType": "NPU"
      },
      {
        "ciDisplayName": "NPU4(A2-IT301-I06-26U-TS-A924-089)",
        "ciName": "NPU4(A2-IT301-I06-26U-TS-A924-089)",
        "cmdbId": "1d2a7b39-c25e-431c-a852-257c81d706e4",
        "ciType": "NPU",
        "ciSubType": "NPU"
      },
      {
        "ciDisplayName": "NPU5(A2-IT301-I06-26U-TS-A924-089)",
        "ciName": "NPU5(A2-IT301-I06-26U-TS-A924-089)",
        "cmdbId": "3cf5b6de-4d51-4ea9-8c9f-04df11a35525",
        "ciType": "NPU",
        "ciSubType": "NPU"
      },
      {
        "ciDisplayName": "A2-IT301-I06-26U-TS-A924-089",
        "ciName": "A2-IT301-I06-26U-TS-A924-089",
        "cmdbId": "a245d378-e343-4317-88f3-e562026e1dc9",
        "ciType": "PhysicalServer",
        "ciSubType": "PhysicalServer"
      },
      {
        "ciDisplayName": "A2-IT301-I06-26U-TS-A924-088",
        "ciName": "A2-IT301-I06-26U-TS-A924-088",
        "cmdbId": "ec913831-b603-4762-912a-409631684636",
        "ciType": "PhysicalServer",
        "ciSubType": "PhysicalServer"
      },
      {
        "ciDisplayName": "集群",
        "ciName": "集群",
        "cmdbId": "8d46082d-81fb-4b90-b126-eedc75a19196",
        "ciType": "Cluster",
        "ciSubType": "compute"
      },
      {
        "ciDisplayName": "机房1机柜2",
        "ciName": "机房1机柜2",
        "cmdbId": "a3ba3093-181b-4097-9c6d-f11d45a1ff65",
        "ciType": "Rack",
        "ciSubType": "Rack"
      },
      {
        "ciDisplayName": "CDU(18.21.56.33)",
        "ciName": "CDU(18.21.56.33)",
        "cmdbId": "cd4a2045-75ec-426e-a457-cfa591a13824",
        "ciType": "CDU",
        "ciSubType": "CDU"
      }
    ],
    "edges": [
      { "targetId": "ac371e92-bc52-4ea9-8368-76bc51643992", "srcId": "14537ad8-df06-4fb9-a584-e3a30b80b877", "count": 3 },
      { "targetId": "548ae1df-984a-4230-874f-1a0b009d4e9d", "srcId": "14537ad8-df06-4fb9-a584-e3a30b80b877", "count": 2 },
      { "targetId": "80033788-d959-4d5b-badc-be974e2ae782", "srcId": "14537ad8-df06-4fb9-a584-e3a30b80b877", "count": 2 },
      { "targetId": "4d152341-e4bc-4757-bb24-d8e5b7607f47", "srcId": "14537ad8-df06-4fb9-a584-e3a30b80b877", "count": 2 },
      { "targetId": "90456ce2-1830-4b3f-8d08-46341d99cb74", "srcId": "14537ad8-df06-4fb9-a584-e3a30b80b877", "count": 2 },
      { "targetId": "2ef9cd84-71f5-49ea-943b-9c22c2ce9832", "srcId": "14537ad8-df06-4fb9-a584-e3a30b80b877", "count": 2 },
      { "targetId": "425f2a75-f3fc-4fde-9aeb-f7276fd2f89a", "srcId": "14537ad8-df06-4fb9-a584-e3a30b80b877", "count": 2 },
      { "targetId": "d23a2412-7262-4703-8669-510734129c56", "srcId": "14537ad8-df06-4fb9-a584-e3a30b80b877", "count": 2 },
      { "targetId": "288d764a-a988-485c-b307-2165caf40648", "srcId": "14537ad8-df06-4fb9-a584-e3a30b80b877", "count": 2 },
      { "targetId": "303fe5ff-987b-48eb-91cd-d36e5fcb2eba", "srcId": "14537ad8-df06-4fb9-a584-e3a30b80b877", "count": 2 },
      { "targetId": "655065ae-3096-4d32-8f8b-d7621a2f8833", "srcId": "14537ad8-df06-4fb9-a584-e3a30b80b877", "count": 2 },
      { "targetId": "f9cd6845-8517-4c76-858f-624279969ea6", "srcId": "14537ad8-df06-4fb9-a584-e3a30b80b877", "count": 2 },
      { "targetId": "b050783c-cae3-4933-ad77-9f437a0f6d85", "srcId": "14537ad8-df06-4fb9-a584-e3a30b80b877", "count": 2 },
      { "targetId": "0092755d-b006-4fab-8558-270d3e956325", "srcId": "14537ad8-df06-4fb9-a584-e3a30b80b877", "count": 2 },
      { "targetId": "de7156fa-0a2b-464b-a7b5-86ac0149a3a6", "srcId": "14537ad8-df06-4fb9-a584-e3a30b80b877", "count": 2 },
      { "targetId": "1d2a7b39-c25e-431c-a852-257c81d706e4", "srcId": "14537ad8-df06-4fb9-a584-e3a30b80b877", "count": 2 },
      { "targetId": "3cf5b6de-4d51-4ea9-8c9f-04df11a35525", "srcId": "14537ad8-df06-4fb9-a584-e3a30b80b877", "count": 2 },
      { "targetId": "14537ad8-df06-4fb9-a584-e3a30b80b877", "srcId": "de7156fa-0a2b-464b-a7b5-86ac0149a3a6", "count": 2 },
      { "targetId": "a245d378-e343-4317-88f3-e562026e1dc9", "srcId": "de7156fa-0a2b-464b-a7b5-86ac0149a3a6", "count": 3 },
      { "targetId": "14537ad8-df06-4fb9-a584-e3a30b80b877", "srcId": "3cf5b6de-4d51-4ea9-8c9f-04df11a35525", "count": 2 },
      { "targetId": "a245d378-e343-4317-88f3-e562026e1dc9", "srcId": "3cf5b6de-4d51-4ea9-8c9f-04df11a35525", "count": 3 },
      { "targetId": "14537ad8-df06-4fb9-a584-e3a30b80b877", "srcId": "1d2a7b39-c25e-431c-a852-257c81d706e4", "count": 2 },
      { "targetId": "a245d378-e343-4317-88f3-e562026e1dc9", "srcId": "1d2a7b39-c25e-431c-a852-257c81d706e4", "count": 3 },
      { "targetId": "14537ad8-df06-4fb9-a584-e3a30b80b877", "srcId": "b050783c-cae3-4933-ad77-9f437a0f6d85", "count": 2 },
      { "targetId": "a245d378-e343-4317-88f3-e562026e1dc9", "srcId": "b050783c-cae3-4933-ad77-9f437a0f6d85", "count": 3 },
      { "targetId": "14537ad8-df06-4fb9-a584-e3a30b80b877", "srcId": "4d152341-e4bc-4757-bb24-d8e5b7607f47", "count": 2 },
      { "targetId": "ec913831-b603-4762-912a-409631684636", "srcId": "4d152341-e4bc-4757-bb24-d8e5b7607f47", "count": 3 },
      { "targetId": "14537ad8-df06-4fb9-a584-e3a30b80b877", "srcId": "f9cd6845-8517-4c76-858f-624279969ea6", "count": 2 },
      { "targetId": "a245d378-e343-4317-88f3-e562026e1dc9", "srcId": "f9cd6845-8517-4c76-858f-624279969ea6", "count": 3 },
      { "targetId": "14537ad8-df06-4fb9-a584-e3a30b80b877", "srcId": "548ae1df-984a-4230-874f-1a0b009d4e9d", "count": 2 },
      { "targetId": "ec913831-b603-4762-912a-409631684636", "srcId": "548ae1df-984a-4230-874f-1a0b009d4e9d", "count": 3 },
      { "targetId": "14537ad8-df06-4fb9-a584-e3a30b80b877", "srcId": "ac371e92-bc52-4ea9-8368-76bc51643992", "count": 2 },
      { "targetId": "14537ad8-df06-4fb9-a584-e3a30b80b877", "srcId": "303fe5ff-987b-48eb-91cd-d36e5fcb2eba", "count": 2 },
      { "targetId": "ec913831-b603-4762-912a-409631684636", "srcId": "303fe5ff-987b-48eb-91cd-d36e5fcb2eba", "count": 3 },
      { "targetId": "14537ad8-df06-4fb9-a584-e3a30b80b877", "srcId": "90456ce2-1830-4b3f-8d08-46341d99cb74", "count": 2 },
      { "targetId": "ec913831-b603-4762-912a-409631684636", "srcId": "90456ce2-1830-4b3f-8d08-46341d99cb74", "count": 3 },
      { "targetId": "14537ad8-df06-4fb9-a584-e3a30b80b877", "srcId": "288d764a-a988-485c-b307-2165caf40648", "count": 2 },
      { "targetId": "ec913831-b603-4762-912a-409631684636", "srcId": "288d764a-a988-485c-b307-2165caf40648", "count": 3 },
      { "targetId": "14537ad8-df06-4fb9-a584-e3a30b80b877", "srcId": "655065ae-3096-4d32-8f8b-d7621a2f8833", "count": 2 },
      { "targetId": "ec913831-b603-4762-912a-409631684636", "srcId": "655065ae-3096-4d32-8f8b-d7621a2f8833", "count": 3 },
      { "targetId": "14537ad8-df06-4fb9-a584-e3a30b80b877", "srcId": "2ef9cd84-71f5-49ea-943b-9c22c2ce9832", "count": 2 },
      { "targetId": "a245d378-e343-4317-88f3-e562026e1dc9", "srcId": "2ef9cd84-71f5-49ea-943b-9c22c2ce9832", "count": 3 },
      { "targetId": "14537ad8-df06-4fb9-a584-e3a30b80b877", "srcId": "0092755d-b006-4fab-8558-270d3e956325", "count": 2 },
      { "targetId": "ec913831-b603-4762-912a-409631684636", "srcId": "0092755d-b006-4fab-8558-270d3e956325", "count": 3 },
      { "targetId": "14537ad8-df06-4fb9-a584-e3a30b80b877", "srcId": "80033788-d959-4d5b-badc-be974e2ae782", "count": 2 },
      { "targetId": "a245d378-e343-4317-88f3-e562026e1dc9", "srcId": "80033788-d959-4d5b-badc-be974e2ae782", "count": 3 },
      { "targetId": "14537ad8-df06-4fb9-a584-e3a30b80b877", "srcId": "d23a2412-7262-4703-8669-510734129c56", "count": 2 },
      { "targetId": "a245d378-e343-4317-88f3-e562026e1dc9", "srcId": "d23a2412-7262-4703-8669-510734129c56", "count": 3 },
      { "targetId": "14537ad8-df06-4fb9-a584-e3a30b80b877", "srcId": "425f2a75-f3fc-4fde-9aeb-f7276fd2f89a", "count": 2 },
      { "targetId": "ec913831-b603-4762-912a-409631684636", "srcId": "425f2a75-f3fc-4fde-9aeb-f7276fd2f89a", "count": 3 },
      { "targetId": "8d46082d-81fb-4b90-b126-eedc75a19196", "srcId": "ec913831-b603-4762-912a-409631684636", "count": 2 },
      { "targetId": "a3ba3093-181b-4097-9c6d-f11d45a1ff65", "srcId": "ec913831-b603-4762-912a-409631684636", "count": 2 },
      { "targetId": "8d46082d-81fb-4b90-b126-eedc75a19196", "srcId": "a245d378-e343-4317-88f3-e562026e1dc9", "count": 2 },
      { "targetId": "a3ba3093-181b-4097-9c6d-f11d45a1ff65", "srcId": "a245d378-e343-4317-88f3-e562026e1dc9", "count": 2 },
      { "targetId": "cd4a2045-75ec-426e-a457-cfa591a13824", "srcId": "a3ba3093-181b-4097-9c6d-f11d45a1ff65", "count": 2 }
    ],
    "startVertexes": [
      {
        "ciDisplayName": "模型服务千问实例",
        "ciName": "模型服务千问实例",
        "cmdbId": "14537ad8-df06-4fb9-a584-e3a30b80b877",
        "ciType": "InferenceModelInstance",
        "ciSubType": "InferenceModelInstance"
      }
    ],
    "luiStyle": {
      "contextType": "Topo Data",
      "showType": "2D Topo Graph"
    }
  }
}`,
  knowledge: '666',
  command: '777',
  judge: '999',
  inference: '结果123456',
}
