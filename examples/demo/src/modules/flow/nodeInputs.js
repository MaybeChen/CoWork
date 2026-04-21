export const NODE_INPUTS = {
  log: `{
  "code": 200,
  "data": "answer:{\"fieldRelations\":[{\"fieldKey\":\"id\",\"fieldNameCn\":\"CI ID\",\"fieldNameEn\":\"CI ID\",\"fieldOrder\":1,\"filterType\":\"NONE\",\"valueType\":\"String\",\"enumValues\":\"\",\"url\":\"\"},{\"fieldKey\":\"name\",\"fieldNameCn\":\"CI名称\",\"fieldNameEn\":\"CI Name\",\"fieldOrder\":2,\"filterType\":\"NONE\",\"valueType\":\"String\",\"enumValues\":\"\",\"url\":\"\"},{\"fieldKey\":\"business_tag\",\"fieldNameCn\":\"业务标签\",\"fieldNameEn\":\"Business Tag\",\"fieldOrder\":3,\"filterType\":\"NONE\",\"valueType\":\"Array\",\"enumValues\":\"\",\"url\":\"\"},{\"fieldKey\":\"type\",\"fieldNameCn\":\"类型\",\"fieldNameEn\":\"CI Type\",\"fieldOrder\":4,\"filterType\":\"NONE\",\"valueType\":\"String\",\"enumValues\":\"\",\"url\":\"\"},{\"fieldKey\":\"subtype\",\"fieldNameCn\":\"子类型\",\"fieldNameEn\":\"CI Subtype\",\"fieldOrder\":5,\"filterType\":\"NONE\",\"valueType\":\"String\",\"enumValues\":\"\",\"url\":\"\"},{\"fieldKey\":\"organization\",\"fieldNameCn\":\"CI组织\",\"fieldNameEn\":\"CI Organisation\",\"fieldOrder\":6,\"filterType\":\"NONE\",\"valueType\":\"String\",\"enumValues\":\"\",\"url\":\"\"},{\"fieldKey\":\"istatus\",\"fieldNameCn\":\"CI状态\",\"fieldNameEn\":\"Status\",\"fieldOrder\":7,\"filterType\":\"FILTER\",\"valueType\":\"Enum\",\"enumValues\":[{\"code\":\"normal\",\"name\":\"正常\"},{\"code\":\"offline\",\"name\":\"离线\"},{\"code\":\"abnormal\",\"name\":\"故障\"},{\"code\":\"unknown\",\"name\":\"未知\"}],\"url\":\"\"},{\"fieldKey\":\"contact_name\",\"fieldNameCn\":\"CI使用人\",\"fieldNameEn\":\"CI Owner\",\"fieldOrder\":8,\"filterType\":\"NONE\",\"valueType\":\"String\",\"enumValues\":\"\",\"url\":\"\"}],\"data\":[{\"service_ip\":\"\",\"exception_status_desc\":\"\",\"agent_name\":\"\",\"site_type\":\"\",\"source\":\"CMDB\",\"type\":\"InferenceModelInstance\",\"inference_model_type\":\"\",\"launch_time\":\"\",\"last_updated_by\":\"hcadmin001\",\"provider\":\"\",\"supported_applications\":\"\",\"subtype\":\"InferenceModelInstance\",\"third_party_model_name\":\"\",\"business_type\":\"\",\"name_i18n\":{},\"service_code\":\"\",\"tag\":{\"originalLabel\":[],\"values\":[],\"tagPos\":null,\"tags\":{}},\"id\":\"14537ad8-df06-4fb9-a584-e3a30b80b877\",\"last_update_date\":1770773127402,\"del_flag\":\"N\",\"contact_name\":\"\",\"comments\":\"\",\"inference_model_name\":\"\",\"assignment\":\"dev\",\"istatus\":\"healthy\",\"display_name\":\"模型服务千问实例\",\"created_by\":\"hcadmin001\",\"_tenant\":\"HWCloudInfra\",\"business_tag\":[],\"site_name\":\"\",\"class_Name\":\"InferenceModelInstance\",\"created_by_date\":1770773127402,\"parent_application_name\":\"\",\"organization\":\"\",\"name\":\"模型服务千问实例\",\"service_port\":\"\"}],\"luiStyle\":{\"contextType\":\"Ci List Data\",\"showType\":\"Table\"},\"summary\":\"已为你识别到 1 条数据，前 1 条数据列表如下：\",\"requestBody\":{\"search\":{\"type\":[\"InferenceModelInstance\"],\"name\":[\"模型服务千问实例\"]},\"pageSize\":100},\"_context.sys.current_date_time\":\"2026-04-08 11:09:41\"}",
  "body": {
    "summary": "已为你识别到 1 条数据，前 1 条数据列表如下：",
    "data": [
      {
        "service_ip": "",
        "exception_status_desc": "",
        "agent_name": "",
        "site_type": "",
        "source": "CMDB",
        "type": "InferenceModelInstance",
        "inference_model_type": "",
        "launch_time": "",
        "last_updated_by": "hcadmin001",
        "provider": "",
        "supported_applications": "",
        "subtype": "InferenceModelInstance",
        "third_party_model_name": "",
        "business_type": "",
        "name_i18n": {},
        "service_code": "",
        "tag": {
          "values": [],
          "originalLabel": [],
          "tags": {}
        },
        "id": "14537ad8-df06-4fb9-a584-e3a30b80b877",
        "last_update_date": 1770773127402,
        "del_flag": "N",
        "contact_name": "",
        "comments": "",
        "inference_model_name": "",
        "assignment": "dev",
        "istatus": "healthy",
        "display_name": "模型服务千问实例",
        "created_by": "hcadmin001",
        "_tenant": "HWCloudInfra",
        "business_tag": [],
        "site_name": "",
        "class_Name": "InferenceModelInstance",
        "created_by_date": 1770773127402,
        "parent_application_name": "",
        "organization": "",
        "name": "模型服务千问实例",
        "service_port": ""
      }
    ],
    "requestBody": {
      "search": {
        "name": [
          "模型服务千问实例"
        ],
        "type": [
          "InferenceModelInstance"
        ]
      },
      "pageSize": 100
    },
    "fieldRelations": [
      {
        "fieldNameCn": "CI ID",
        "fieldKey": "id",
        "valueType": "String",
        "fieldOrder": 1,
        "filterType": "NONE",
        "fieldNameEn": "CI ID",
        "url": "",
        "enumValues": ""
      },
      {
        "fieldNameCn": "CI名称",
        "fieldKey": "name",
        "valueType": "String",
        "fieldOrder": 2,
        "filterType": "NONE",
        "fieldNameEn": "CI Name",
        "url": "",
        "enumValues": ""
      },
      {
        "fieldNameCn": "业务标签",
        "fieldKey": "business_tag",
        "valueType": "Array",
        "fieldOrder": 3,
        "filterType": "NONE",
        "fieldNameEn": "Business Tag",
        "url": "",
        "enumValues": ""
      },
      {
        "fieldNameCn": "类型",
        "fieldKey": "type",
        "valueType": "String",
        "fieldOrder": 4,
        "filterType": "NONE",
        "fieldNameEn": "CI Type",
        "url": "",
        "enumValues": ""
      },
      {
        "fieldNameCn": "子类型",
        "fieldKey": "subtype",
        "valueType": "String",
        "fieldOrder": 5,
        "filterType": "NONE",
        "fieldNameEn": "CI Subtype",
        "url": "",
        "enumValues": ""
      },
      {
        "fieldNameCn": "CI组织",
        "fieldKey": "organization",
        "valueType": "String",
        "fieldOrder": 6,
        "filterType": "NONE",
        "fieldNameEn": "CI Organisation",
        "url": "",
        "enumValues": ""
      },
      {
        "fieldNameCn": "CI状态",
        "fieldKey": "istatus",
        "valueType": "Enum",
        "fieldOrder": 7,
        "filterType": "FILTER",
        "fieldNameEn": "Status",
        "url": "",
        "enumValues": [
          {
            "code": "normal",
            "name": "正常"
          },
          {
            "code": "offline",
            "name": "离线"
          },
          {
            "code": "abnormal",
            "name": "故障"
          },
          {
            "code": "unknown",
            "name": "未知"
          }
        ]
      },
      {
        "fieldNameCn": "CI使用人",
        "fieldKey": "contact_name",
        "valueType": "String",
        "fieldOrder": 8,
        "filterType": "NONE",
        "fieldNameEn": "CI Owner",
        "url": "",
        "enumValues": ""
      }
    ],
    "_context.sys.current_date_time": "2026-04-08 11:09:41",
    "luiStyle": {
      "contextType": "Ci List Data",
      "showType": "Table"
    }
  }
}`,
  alert: `{
  "result": {
    "executionDetails": {},
    "exceptionInfos": [
      {
        "exceptionLogTime": "2026/2/13 19:44:30",
        "exceptionType": "服务日志",
        "logType": "collect",
        "logContent": "首次告警：Dynamic batch error: input length varies (128-4096 tokens) in batch",
        "abnormalityDescription": "首次告警：Dynamic batch error: input length varies (128-4096 tokens) in batch",
        "abnormalityId": "f0fbb624-5c13-45a4-901f-33d848ead7d2",
        "ciId": "f0fbb624-5c13-45a4-901f-33d848ead7d2",
        "ciName": "PJINS-HJ6863E-STALI-BRH-TX1-1_25GE1/0/46",
        "ciType": "Port",
        "ciSubType": "Port",
        "alarmLevel": 3
      },
      {
        "exceptionLogTime": "2026/2/13 19:45:30",
        "exceptionType": "负载均衡器日志",
        "logType": "collect",
        "logContent": "负载失衡告警：Node 10.1.1.101: NPU utilization 100%, Node 10.1.1.102: NPU utilization 35%",
        "abnormalityDescription": "负载失衡告警：Node 10.1.1.101: NPU utilization 100%, Node 10.1.1.102: NPU utilization 35%",
        "abnormalityId": "f0fbb624-5c13-45a4-901f-33d848ead7d2",
        "ciId": "f0fbb624-5c13-45a4-901f-33d848ead7d2",
        "ciName": "PJINS-HJ6863E-STALI-BRH-TX1-1_25GE1/0/46",
        "ciType": "Port",
        "ciSubType": "Port",
        "alarmLevel": 4
      },
      {
        "exceptionLogTime": "2026/2/13 19:47:30",
        "exceptionType": "服务访问日志",
        "logType": "collect",
        "logContent": "请求超时雪崩：2000+ requests timed out (5000ms), queue backlog 10000+",
        "abnormalityDescription": "请求超时雪崩：2000+ requests timed out (5000ms), queue backlog 10000+",
        "abnormalityId": "f0fbb624-5c13-45a4-901f-33d848ead7d2",
        "ciId": "f0fbb624-5c13-45a4-901f-33d848ead7d2",
        "ciName": "PJINS-HJ6863E-STALI-BRH-TX1-1_25GE1/0/46",
        "ciType": "Port",
        "ciSubType": "Port",
        "alarmLevel": 5
      },
      {
        "exceptionLogTime": "2026/1/13 19:48:30",
        "exceptionType": "系统日志",
        "logType": "collect",
        "logContent": "服务进程崩溃：inference_server killed by signal 9 (OOM)",
        "abnormalityDescription": "服务进程崩溃：inference_server killed by signal 9 (OOM)",
        "abnormalityId": "f0fbb624-5c13-45a4-901f-33d848ead7d2",
        "ciId": "f0fbb624-5c13-45a4-901f-33d848ead7d2",
        "ciName": "PJINS-HJ6863E-STALI-BRH-TX1-1_25GE1/0/46",
        "ciType": "Port",
        "ciSubType": "Port",
        "alarmLevel": 6
      },
      {
        "exceptionLogTime": "2026/2/13 19:49:30",
        "exceptionType": "网络中间件日志",
        "logType": "collect",
        "logContent": "网络过载告警：gRPC error: Unavailable: connection closed due to high load",
        "abnormalityDescription": "网络过载告警：gRPC error: Unavailable: connection closed due to high load",
        "abnormalityId": "f0fbb624-5c13-45a4-901f-33d848ead7d2",
        "ciId": "f0fbb624-5c13-45a4-901f-33d848ead7d2",
        "ciName": "PJINS-HJ6863E-STALI-BRH-TX1-1_25GE1/0/46",
        "ciType": "Port",
        "ciSubType": "Port",
        "alarmLevel": 3
      }
    ]
  }
}`,
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
