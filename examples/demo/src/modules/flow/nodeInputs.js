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
  ticket: `查询工单信息
工单ID：FA163E7E2758FF190C0B0DB845DEFE2C
工单标题：转发引擎整体功能失效告警转工单
开始时间：2026-03-23 09:08:17
创建人：System
创建时间：2026-03-23 17:08:17
当前步骤名称：一线处理阶段
当前处理人：hcadmin001
模型id：FA163E7E2758EE130BF9684A218AC8BF
模型类型：事件工单
工单处理时长：29.0天
修改时间：2026-03-23 17:08:17
工单流水号：alarm202603231zdd
工单来源：alarm
工单状态：processing
处理类型：mainprocess
收起
查询工单关联告警
告警标题：转发引擎整体功能失效
显示名称：YGAA2-2F02-08-14-A1P1-LQL2switch-LQLEAF-HW630-02U43_display
监控对象：YGAA2-2F02-08-14-A1P1-LQL2switch-LQLEAF-HW630-02U43
对象类型：NetworkDevice
对象子类型：LQL2Switch
告警编码：019d19f316f97049b889461721f92bdd
告警描述：3-3tCcAErUA2U_转发芯片转发寄存器不稳定
告警级别：提示
告警状态：已获悉
首次发生时间：2026-03-03 05:14:26
最后发生时间：2026-03-03 05:14:26
告警清除时间：
工单编号：alarm202603231zdd
告警次数：1970-01-01 08:00:00
压缩规则结果：父告警
群组：ZGY_Test
定位信息：实体索引=16842755,实体名称=Slot 1 Forward engine 4,实体类型=1,故障码=155904:转发芯片转发寄存器不稳定
附加信息：Trap OID=1.3.6.1.4.1.2011.5.25.219.2.2.70
专业域：公共域
收起
状态和资源信息提取
状态名称：转发引擎整体功能失效
对象类型：NetworkDevice
对象子类型：LQL2Switch
对象名称：YGAA2-2F02-08-14-A1P1-LQL2switch-LQLEAF-HW630-02U43
发生时间：2026-03-03 05:14:26`,
  metric: `{
  "result": {
    "code": 200,
    "data": "metricValues:",
    "errorMessage": "",
    "body": {
      "data": [],
      "fieldRelations": [
        {
          "fieldNameCn": "对象名称",
          "fieldKey": "displayName",
          "valueType": "String",
          "filedOrder": 1,
          "filterType": "NONE",
          "fieldNameEn": "CI Name",
          "url": null,
          "enumValues": null
        },
        {
          "fieldNameCn": "最大值",
          "fieldKey": "metricValueMax",
          "valueType": "String",
          "filedOrder": 2,
          "filterType": "NONE",
          "fieldNameEn": "Maximum Value",
          "url": null,
          "enumValues": null
        },
        {
          "fieldNameCn": "最小值",
          "fieldKey": "metricValueMin",
          "valueType": "String",
          "filedOrder": 3,
          "filterType": "NONE",
          "fieldNameEn": "Minimum Value",
          "url": null,
          "enumValues": null
        },
        {
          "fieldNameCn": "平均值",
          "fieldKey": "metricValueAvg",
          "valueType": "String",
          "filedOrder": 4,
          "filterType": "NONE",
          "fieldNameEn": "Average Value",
          "url": null,
          "enumValues": null
        }
      ],
      "luiStyle": {
        "contextType": "Metric",
        "showType": "Chart Table"
      }
    }
  }
}`,
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
  knowledge: `2026年Q1 产品线营收概况
计算实例 (Compute)：本季度表现最强，总营收 4,500 万元，占据了市场份额的 45%，是核心增长引擎。

对象存储 (Storage)：表现稳健，营收 2,500 万元，占比 25%，随企业数字化转型需求持续上升。

数据库 (Database)：营收为 1,500 万元，占比 15%，主要受金融客户迁移驱动。

网络带宽 (Networking)：营收 1,000 万元，占比 10%。

安全服务 (Security)：虽然目前营收仅为 500 万元，占比 5%，但同比增速最高，属于潜力板块。`,
  command: `registry=https://cmc.centralrepo.rnd.huawei.com/artifactory/api/npm/npm-central-repo/
npm set strict-ssl false
export PUPPETEER_SKIP_DOWNLOAD=true
workDir=$(cd $(dirname $0); pwd)
echo work dir: $workDir
mkdir target
echo create target dir

echo ------- work path -------
pwd

echo ------- node version -------
node -v

echo ------- npm version -------
npm -v

echo ------- npm install begin -------
cd $workDir/
npm --registry $registry install esbuild-linux-64@0.15.18 -D --omit=optional
npm --registry $registry install @rollup/rollup-linux-x64-gnu -D --omit=optional
echo ------- npm install end -------

echo ------- run build begin -------
cd $workDir/

if [ "${isMvp}" == true ]; then
  npm run build:mvpprod
elif [ "${isRelease}" == true ]; then
  npm run build
else
  npm run build:uat
fi
if [ $? -ne 0 ]; then
    echo "编译失败"
    exit 1
else
    echo "编译成功"
fi
echo ------- run build end -------

echo ------- make image begin -------
cd $workDir/
if [ "${IS_UAT}" == "false" ];then
  docker pull cd-docker-hub.szg1.artifactory.inhuawei.com/tpsp_o3/susex86nginx:23.3.2
  docker tag cd-docker-hub.szg1.artifactory.inhuawei.com/tpsp_o3/susex86nginx:23.3.2 susex86nginx:23.3.2
  if [ "${isRelease}" == true ]; then
    image_version=${ENV_RELEASE_VERSION}
  else
    image_version=${buildVersion}
  fi
  docker build -t asko3portal:${image_version} --network host --no-cache . -f Dockerfile
  docker save -o asko3portal.tar.gz asko3portal:${image_version}
  mv asko3portal.tar.gz $workDir/target
elif [ "${isMvp}" == true ]; then
  tar -zcvf asko3portalMvp.tar.gz scripts/nginx.conf dist/ scripts/customize_dockerfile.sh scripts/mycrond.sh scripts/entrypoint.sh scripts/*.txt
  mv asko3portalMvp.tar.gz $workDir/target
else
  tar -zcvf asko3portal.tar.gz scripts/nginx.conf dist/ scripts/customize_dockerfile.sh scripts/mycrond.sh scripts/entrypoint.sh scripts/*.txt
  mv asko3portal.tar.gz $workDir/target
fi

echo ------- sourcemap打包 -------
zip -r sourcemap.zip sourcemap/
mv sourcemap.zip $workDir/target

echo ------- 部署文件打包 -------
tar -zcvf deploy.tar.gz -C$workDir/deploy prod/asko3-frontend-prod.yaml -C$workDir/deploy mvpbeta/asko3-frontend-mvp-beta.yaml -C$workDir/deploy uat/asko3-frontend.yaml -C$workDir/deploy mvp/asko3-frontend-mvp.yaml
cp deploy.tar.gz $workDir/target

# set buildVersion
echo "Release is ${ENV_IS_RELEASE}"
if [ "${ENV_IS_RELEASE}" == "false" ];then
    echo "buildVersion=${buildVersion}.${ENV_PIPELINE_STARTTIME}">${WORKSPACE}/buildInfo.properties
else
    if [ "${ENV_IS_RELEASE}" == "true" ];then
        echo "buildVersion=${ENV_RELEASE_VERSION}">${WORKSPACE}/buildInfo.properties
    fi
fi

cd $workDir/target
ls`,
  judge: `{
  "output": [
    {
      "rootCause": "模型服务千问实例调用多个NPU资源时出现资源竞争或调度延迟",
      "rootCauseTitle": "NPU资源调度延迟",
      "rootCauseConfidence": 7,
      "ciType": "InferenceModelInstance",
      "ciName": "模型服务千问实例",
      "abnormality": [
        {
          "ciId": "14537ad8-df06-4fb9-a584-e3a30b80b877",
          "ciName": "模型服务千问实例",
          "abnormalityId": "019d6afe5cbd7309ad650db03ad964a3",
          "abnormalityType": "告警",
          "abnormalityName": "模型实例时延过长",
          "abnormalityDescription": "来自于CCAE，调测序号=3"
        }
      ],
      "transmissionChain": [
        {
          "abnormalityIdFrom": "019d6afe5cbd7309ad650db03ad964a3",
          "abnormalityIdTo": "019d6afe5cbd7309ad650db03ad964a3",
          "type": "触发"
        }
      ],
      "evidenceChain": [
        "2026-04-08 10:50:34 告警显示模型服务千问实例出现时延过长",
        "拓扑分析显示该模型实例连接16个NPU节点（NPU1-NPU8分布在两台物理服务器上）",
        "告警级别为2（重要）表明属于关键性能问题",
        "无指标和日志异常数据支撑具体硬件故障，需重点排查NPU资源调度机制"
      ],
      "influence": [
        "影响模型服务千问实例的推理响应时间",
        "可能波及依赖该模型服务的下游业务链路"
      ],
      "repairSuggestion": [
        "检查NPU资源调度策略是否合理，优化并发请求分配",
        "验证NPU设备性能状态，确认是否存在硬件资源瓶颈",
        "分析调测序号3的详细调用链路，定位具体延迟环节"
      ],
      "flowGraph": "graph TD
    A[2026-04-08 10:50:34 模型服务千问实例告警触发] --> B[拓扑显示连接16个NPU节点]
    B --> C[告警级别2表明关键性能问题]
    C --> D[无指标日志异常需排查调度机制]"
    }
  ],
  "reasoning_output": "
好的，我现在需要处理用户提供的关于模型服务千问实例在2026-04-08 10:50:34出现的时延过长告警。首先，我得仔细分析用户提供的所有数据，包括告警信息、指标分析、日志分析和拓扑结构。

首先看告警分析结果，告警编码是019d6afe5cbd7309ad650db03ad964a3，标题是“模型实例时延过长”，属于InferenceModelInstance类型，告警级别是2（重要）。关联告警信息显示该告警来自CCAE，调测序号3，但指标和日志分析结果中没有发现异常，这可能意味着问题不在常规指标或日志中，需要从拓扑结构入手。

接下来是拓扑分析，模型服务千问实例连接了多个NPU设备，分布在两台物理服务器上（A924-088和A924-089），这些NPU又连接到集群和机房1机柜2。边数据表明模型实例与多个NPU有直接连接，而NPU又连接到各自的物理服务器，再连接到集群和机柜。

由于指标和日志没有异常，可能的问题可能出在NPU资源分配或调度上。比如，模型实例可能同时调用了多个NPU，导致资源竞争或负载不均，从而引起时延。或者某个NPU在处理请求时出现延迟，影响整体性能。

需要检查拓扑中模型实例与NPU的连接情况，是否有某个NPU在该时间点负载过高，或者存在通信瓶颈。但用户提供的数据中没有具体的指标数值，所以只能基于拓扑结构推测。可能模型实例在调用多个NPU时，某些NPU响应慢，导致整体时延增加。

另外，告警描述中提到“调测序号=3”，可能是指第三次调测时出现问题，需要查看是否有历史调测记录中的类似问题。但用户数据中没有提供历史信息，所以无法进一步分析。

可能的根因是模型实例在调用多个NPU时，由于资源分配不均或NPU处理能力不足，导致整体时延过长。需要确认是否有NPU在该时间点出现高负载或处理延迟，但由于缺乏具体指标数据，只能基于拓扑结构推测。

影响范围方面，模型服务千问实例本身受到影响，可能导致依赖该服务的其他应用或任务延迟。修复建议可能包括优化NPU资源分配，检查NPU性能，或者调整模型实例的调度策略。

总结，由于缺乏具体的指标和日志异常，只能基于拓扑结构推测根因为NPU资源分配或处理问题，但置信度可能较低，需要进一步数据验证。
"
}`,
  inference: `{
  "result": {
    "knowledgeDocuments": [
      {
        "reason": [
          "node type=hccp, sensor type=Safety Sensor, event state=use backup link"
        ],
        "file_name": "Atlas A3 中心推理和训练硬件 25.5.0 健康管理故障定义 01.xlsx",
        "description": "",
        "advance": null,
        "ciId": null
      }
    ],
    "inferenceOutput": [
      {
        "rootCauseTitle": "NPU资源调度延迟",
        "flowGraph": "graph TD
    A[2026-04-08 10:50:34 模型服务千问实例告警触发] --> B[拓扑显示连接16个NPU节点]
    B --> C[告警级别2表明关键性能问题]
    C --> D[无指标日志异常需排查调度机制]",
        "transmissionChain": [
          {
            "type": "触发",
            "abnormalityIdFrom": "019d6afe5cbd7309ad650db03ad964a3",
            "abnormalityIdTo": "019d6afe5cbd7309ad650db03ad964a3"
          }
        ],
        "rootCause": "模型服务千问实例调用多个NPU资源时出现资源竞争或调度延迟",
        "abnormality": [
          {
            "abnormalityId": "019d6afe5cbd7309ad650db03ad964a3",
            "abnormalityName": "模型实例时延过长",
            "abnormalityDescription": "来自于CCAE，调测序号=3",
            "abnormalityType": "告警",
            "ciName": "模型服务千问实例",
            "ciId": "14537ad8-df06-4fb9-a584-e3a30b80b877"
          }
        ],
        "repairSuggestion": [
          "检查NPU资源调度策略是否合理，优化并发请求分配",
          "验证NPU设备性能状态，确认是否存在硬件资源瓶颈",
          "分析调测序号3的详细调用链路，定位具体延迟环节"
        ],
        "ciName": "模型服务千问实例",
        "rootCauseConfidence": 7,
        "ciType": "InferenceModelInstance",
        "evidenceChain": [
          "2026-04-08 10:50:34 告警显示模型服务千问实例出现时延过长",
          "拓扑分析显示该模型实例连接16个NPU节点（NPU1-NPU8分布在两台物理服务器上）",
          "告警级别为2（重要）表明属于关键性能问题",
          "无指标和日志异常数据支撑具体硬件故障，需重点排查NPU资源调度机制"
        ],
        "influence": [
          "影响模型服务千问实例的推理响应时间",
          "可能波及依赖该模型服务的下游业务链路"
        ]
      }
    ],
    "executionDetails": "
好的，我现在需要处理用户提供的关于模型服务千问实例在2026-04-08 10:50:34出现的时延过长告警。首先，我得仔细分析用户提供的所有数据，包括告警信息、指标分析、日志分析和拓扑结构。

首先看告警分析结果，告警编码是019d6afe5cbd7309ad650db03ad964a3，标题是“模型实例时延过长”，属于InferenceModelInstance类型，告警级别是2（重要）。关联告警信息显示该告警来自CCAE，调测序号3，但指标和日志分析结果中没有发现异常，这可能意味着问题不在常规指标或日志中，需要从拓扑结构入手。

接下来是拓扑分析，模型服务千问实例连接了多个NPU设备，分布在两台物理服务器上（A924-088和A924-089），这些NPU又连接到集群和机房1机柜2。边数据表明模型实例与多个NPU有直接连接，而NPU又连接到各自的物理服务器，再连接到集群和机柜。

由于指标和日志没有异常，可能的问题可能出在NPU资源分配或调度上。比如，模型实例可能同时调用了多个NPU，导致资源竞争或负载不均，从而引起时延。或者某个NPU在处理请求时出现延迟，影响整体性能。

需要检查拓扑中模型实例与NPU的连接情况，是否有某个NPU在该时间点负载过高，或者存在通信瓶颈。但用户提供的数据中没有具体的指标数值，所以只能基于拓扑结构推测。可能模型实例在调用多个NPU时，某些NPU响应慢，导致整体时延增加。

另外，告警描述中提到“调测序号=3”，可能是指第三次调测时出现问题，需要查看是否有历史调测记录中的类似问题。但用户数据中没有提供历史信息，所以无法进一步分析。

可能的根因是模型实例在调用多个NPU时，由于资源分配不均或NPU处理能力不足，导致整体时延过长。需要确认是否有NPU在该时间点出现高负载或处理延迟，但由于缺乏具体指标数据，只能基于拓扑结构推测。

影响范围方面，模型服务千问实例本身受到影响，可能导致依赖该服务的其他应用或任务延迟。修复建议可能包括优化NPU资源分配，检查NPU性能，或者调整模型实例的调度策略。

总结，由于缺乏具体的指标和日志异常，只能基于拓扑结构推测根因为NPU资源分配或处理问题，但置信度可能较低，需要进一步数据验证。
",
    "log_analysis_agent_output": {
      "output": {
        "executionDetails": {},
        "exceptionInfos": []
      }
    },
    "topo_analysis_agent_output": {
      "output": {
        "summary": "已为你识别到 23 个点，55 条边，拓扑关系生成如下：",
        "vertexes": [
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
          }
        ],
        "edges": [
          {
            "targetId": "548ae1df-984a-4230-874f-1a0b009d4e9d",
            "srcId": "14537ad8-df06-4fb9-a584-e3a30b80b877",
            "count": 2
          },
          {
            "targetId": "80033788-d959-4d5b-badc-be974e2ae782",
            "srcId": "14537ad8-df06-4fb9-a584-e3a30b80b877",
            "count": 2
          },
          {
            "targetId": "4d152341-e4bc-4757-bb24-d8e5b7607f47",
            "srcId": "14537ad8-df06-4fb9-a584-e3a30b80b877",
            "count": 2
          },
          {
            "targetId": "90456ce2-1830-4b3f-8d08-46341d99cb74",
            "srcId": "14537ad8-df06-4fb9-a584-e3a30b80b877",
            "count": 2
          },
          {
            "targetId": "2ef9cd84-71f5-49ea-943b-9c22c2ce9832",
            "srcId": "14537ad8-df06-4fb9-a584-e3a30b80b877",
            "count": 2
          },
          {
            "targetId": "425f2a75-f3fc-4fde-9aeb-f7276fd2f89a",
            "srcId": "14537ad8-df06-4fb9-a584-e3a30b80b877",
            "count": 2
          },
          {
            "targetId": "d23a2412-7262-4703-8669-510734129c56",
            "srcId": "14537ad8-df06-4fb9-a584-e3a30b80b877",
            "count": 2
          },
          {
            "targetId": "288d764a-a988-485c-b307-2165caf40648",
            "srcId": "14537ad8-df06-4fb9-a584-e3a30b80b877",
            "count": 2
          },
          {
            "targetId": "303fe5ff-987b-48eb-91cd-d36e5fcb2eba",
            "srcId": "14537ad8-df06-4fb9-a584-e3a30b80b877",
            "count": 2
          },
          {
            "targetId": "655065ae-3096-4d32-8f8b-d7621a2f8833",
            "srcId": "14537ad8-df06-4fb9-a584-e3a30b80b877",
            "count": 2
          },
          {
            "targetId": "f9cd6845-8517-4c76-858f-624279969ea6",
            "srcId": "14537ad8-df06-4fb9-a584-e3a30b80b877",
            "count": 2
          },
          {
            "targetId": "b050783c-cae3-4933-ad77-9f437a0f6d85",
            "srcId": "14537ad8-df06-4fb9-a584-e3a30b80b877",
            "count": 2
          },
          {
            "targetId": "0092755d-b006-4fab-8558-270d3e956325",
            "srcId": "14537ad8-df06-4fb9-a584-e3a30b80b877",
            "count": 2
          },
          {
            "targetId": "de7156fa-0a2b-464b-a7b5-86ac0149a3a6",
            "srcId": "14537ad8-df06-4fb9-a584-e3a30b80b877",
            "count": 2
          },
          {
            "targetId": "1d2a7b39-c25e-431c-a852-257c81d706e4",
            "srcId": "14537ad8-df06-4fb9-a584-e3a30b80b877",
            "count": 2
          },
          {
            "targetId": "3cf5b6de-4d51-4ea9-8c9f-04df11a35525",
            "srcId": "14537ad8-df06-4fb9-a584-e3a30b80b877",
            "count": 2
          },
          {
            "targetId": "14537ad8-df06-4fb9-a584-e3a30b80b877",
            "srcId": "de7156fa-0a2b-464b-a7b5-86ac0149a3a6",
            "count": 2
          },
          {
            "targetId": "a245d378-e343-4317-88f3-e562026e1dc9",
            "srcId": "de7156fa-0a2b-464b-a7b5-86ac0149a3a6",
            "count": 3
          },
          {
            "targetId": "14537ad8-df06-4fb9-a584-e3a30b80b877",
            "srcId": "3cf5b6de-4d51-4ea9-8c9f-04df11a35525",
            "count": 2
          },
          {
            "targetId": "a245d378-e343-4317-88f3-e562026e1dc9",
            "srcId": "3cf5b6de-4d51-4ea9-8c9f-04df11a35525",
            "count": 3
          },
          {
            "targetId": "14537ad8-df06-4fb9-a584-e3a30b80b877",
            "srcId": "1d2a7b39-c25e-431c-a852-257c81d706e4",
            "count": 2
          },
          {
            "targetId": "a245d378-e343-4317-88f3-e562026e1dc9",
            "srcId": "1d2a7b39-c25e-431c-a852-257c81d706e4",
            "count": 3
          },
          {
            "targetId": "14537ad8-df06-4fb9-a584-e3a30b80b877",
            "srcId": "b050783c-cae3-4933-ad77-9f437a0f6d85",
            "count": 2
          },
          {
            "targetId": "a245d378-e343-4317-88f3-e562026e1dc9",
            "srcId": "b050783c-cae3-4933-ad77-9f437a0f6d85",
            "count": 3
          },
          {
            "targetId": "14537ad8-df06-4fb9-a584-e3a30b80b877",
            "srcId": "4d152341-e4bc-4757-bb24-d8e5b7607f47",
            "count": 2
          },
          {
            "targetId": "ec913831-b603-4762-912a-409631684636",
            "srcId": "4d152341-e4bc-4757-bb24-d8e5b7607f47",
            "count": 3
          },
          {
            "targetId": "14537ad8-df06-4fb9-a584-e3a30b80b877",
            "srcId": "f9cd6845-8517-4c76-858f-624279969ea6",
            "count": 2
          },
          {
            "targetId": "a245d378-e343-4317-88f3-e562026e1dc9",
            "srcId": "f9cd6845-8517-4c76-858f-624279969ea6",
            "count": 3
          },
          {
            "targetId": "14537ad8-df06-4fb9-a584-e3a30b80b877",
            "srcId": "548ae1df-984a-4230-874f-1a0b009d4e9d",
            "count": 2
          },
          {
            "targetId": "ec913831-b603-4762-912a-409631684636",
            "srcId": "548ae1df-984a-4230-874f-1a0b009d4e9d",
            "count": 3
          },
          {
            "targetId": "14537ad8-df06-4fb9-a584-e3a30b80b877",
            "srcId": "303fe5ff-987b-48eb-91cd-d36e5fcb2eba",
            "count": 2
          },
          {
            "targetId": "ec913831-b603-4762-912a-409631684636",
            "srcId": "303fe5ff-987b-48eb-91cd-d36e5fcb2eba",
            "count": 3
          },
          {
            "targetId": "14537ad8-df06-4fb9-a584-e3a30b80b877",
            "srcId": "90456ce2-1830-4b3f-8d08-46341d99cb74",
            "count": 2
          },
          {
            "targetId": "ec913831-b603-4762-912a-409631684636",
            "srcId": "90456ce2-1830-4b3f-8d08-46341d99cb74",
            "count": 3
          },
          {
            "targetId": "14537ad8-df06-4fb9-a584-e3a30b80b877",
            "srcId": "288d764a-a988-485c-b307-2165caf40648",
            "count": 2
          },
          {
            "targetId": "ec913831-b603-4762-912a-409631684636",
            "srcId": "288d764a-a988-485c-b307-2165caf40648",
            "count": 3
          },
          {
            "targetId": "14537ad8-df06-4fb9-a584-e3a30b80b877",
            "srcId": "655065ae-3096-4d32-8f8b-d7621a2f8833",
            "count": 2
          },
          {
            "targetId": "ec913831-b603-4762-912a-409631684636",
            "srcId": "655065ae-3096-4d32-8f8b-d7621a2f8833",
            "count": 3
          },
          {
            "targetId": "14537ad8-df06-4fb9-a584-e3a30b80b877",
            "srcId": "2ef9cd84-71f5-49ea-943b-9c22c2ce9832",
            "count": 2
          },
          {
            "targetId": "a245d378-e343-4317-88f3-e562026e1dc9",
            "srcId": "2ef9cd84-71f5-49ea-943b-9c22c2ce9832",
            "count": 3
          },
          {
            "targetId": "14537ad8-df06-4fb9-a584-e3a30b80b877",
            "srcId": "0092755d-b006-4fab-8558-270d3e956325",
            "count": 2
          },
          {
            "targetId": "ec913831-b603-4762-912a-409631684636",
            "srcId": "0092755d-b006-4fab-8558-270d3e956325",
            "count": 3
          },
          {
            "targetId": "14537ad8-df06-4fb9-a584-e3a30b80b877",
            "srcId": "80033788-d959-4d5b-badc-be974e2ae782",
            "count": 2
          },
          {
            "targetId": "a245d378-e343-4317-88f3-e562026e1dc9",
            "srcId": "80033788-d959-4d5b-badc-be974e2ae782",
            "count": 3
          },
          {
            "targetId": "14537ad8-df06-4fb9-a584-e3a30b80b877",
            "srcId": "d23a2412-7262-4703-8669-510734129c56",
            "count": 2
          },
          {
            "targetId": "a245d378-e343-4317-88f3-e562026e1dc9",
            "srcId": "d23a2412-7262-4703-8669-510734129c56",
            "count": 3
          },
          {
            "targetId": "14537ad8-df06-4fb9-a584-e3a30b80b877",
            "srcId": "425f2a75-f3fc-4fde-9aeb-f7276fd2f89a",
            "count": 2
          },
          {
            "targetId": "ec913831-b603-4762-912a-409631684636",
            "srcId": "425f2a75-f3fc-4fde-9aeb-f7276fd2f89a",
            "count": 3
          },
          {
            "targetId": "8d46082d-81fb-4b90-b126-eedc75a19196",
            "srcId": "ec913831-b603-4762-912a-409631684636",
            "count": 2
          },
          {
            "targetId": "a3ba3093-181b-4097-9c6d-f11d45a1ff65",
            "srcId": "ec913831-b603-4762-912a-409631684636",
            "count": 2
          },
          {
            "targetId": "8d46082d-81fb-4b90-b126-eedc75a19196",
            "srcId": "a245d378-e343-4317-88f3-e562026e1dc9",
            "count": 2
          },
          {
            "targetId": "a3ba3093-181b-4097-9c6d-f11d45a1ff65",
            "srcId": "a245d378-e343-4317-88f3-e562026e1dc9",
            "count": 2
          }
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
    },
    "alarm_analysis_agent_output": {
      "output": {
        "processData": {
          "topoData": {},
          "alarm": [
            {
              "locationInfo": "",
              "discribe": "来自于CCAE，调测序号=3",
              "startTime": "2026-04-08 10:50:34",
              "endTime": "2026-04-08 10:50:34",
              "alarmTitle": "模型实例时延过长",
              "alarmCode": "019d6afe5cbd7309ad650db03ad964a3",
              "ciName": "模型服务千问实例",
              "ciType": "InferenceModelInstance",
              "ciSubType": "InferenceModelInstance"
            }
          ]
        },
        "alarmKnowledges": [],
        "associatedAlarms": [
          {
            "locationInfo": null,
            "metricName": null,
            "displayName": "模型服务千问实例",
            "occurCount": 1,
            "mainRule": -1,
            "alarmCode": "019d6afe5cbd7309ad650db03ad964a3",
            "ciName": "模型服务千问实例",
            "url": "/adc-static/static/procodeComp/2000/IMOC-Aiops-MgrWeb-Release/IMOC-Aiops-MgrWeb-Release/mgr-web/0.1.0/dist/index.html#/alarmManage/alarmDetail/019d6afe5cbd7309ad650db03ad964a3/1",
            "ciId": "14537ad8-df06-4fb9-a584-e3a30b80b877",
            "alarmDescription": "来自于CCAE，调测序号=3",
            "groupName": "dev",
            "domain": 0,
            "additionalInfo": null,
            "alarmLevel": 2,
            "newTabTitle": "告警详情 - 模型实例时延过长",
            "alarmTitle": "模型实例时延过长",
            "incidentUpdateTime": "2026-04-08 10:50:34",
            "incidentOpenTime": "2026-04-08 10:50:34",
            "tenant": "HWCloudInfra",
            "fileList": [],
            "ciType": "InferenceModelInstance",
            "ciSubType": "InferenceModelInstance",
            "status": 5
          }
        ],
        "fieldRelations": [],
        "alarm": [
          {
            "locationInfo": "",
            "discribe": "来自于CCAE，调测序号=3",
            "startTime": "2026-04-08 10:50:34",
            "endTime": "2026-04-08 10:50:34",
            "alarmTitle": "模型实例时延过长",
            "alarmCode": "019d6afe5cbd7309ad650db03ad964a3",
            "ciName": "模型服务千问实例",
            "ciType": "InferenceModelInstance",
            "ciSubType": "InferenceModelInstance"
          }
        ],
        "showKeys": [
          "alarmKnowledges",
          "associatedAlarms"
        ],
        "alarmPropationRelation": null
      }
    },
    "metric_analysis_agent_output": {
      "output": {
        "ciInfo": null,
        "exceptionInfos": []
      }
    }
  }
}`,
}
