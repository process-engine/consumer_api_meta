--
-- PostgreSQL database dump
--

-- Dumped from database version 10.2 (Debian 10.2-1.pgdg90+1)
-- Dumped by pg_dump version 10.3

-- Started on 2018-04-09 09:29:36 CEST

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 1 (class 3079 OID 12980)
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- TOC entry 3044 (class 0 OID 0)
-- Dependencies: 1
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 197 (class 1259 OID 16394)
-- Name: NodeInstance; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."NodeInstance" (
    id uuid NOT NULL,
    name character varying,
    key character varying,
    process uuid,
    "nodeDef" uuid,
    type character varying,
    state character varying,
    participant character varying,
    application character varying,
    "processToken" uuid,
    "instanceCounter" double precision
);


ALTER TABLE public."NodeInstance" OWNER TO admin;

--
-- TOC entry 198 (class 1259 OID 16402)
-- Name: Event; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."Event" (
)
INHERITS (public."NodeInstance");


ALTER TABLE public."Event" OWNER TO admin;

--
-- TOC entry 199 (class 1259 OID 16410)
-- Name: BoundaryEvent; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."BoundaryEvent" (
)
INHERITS (public."Event");


ALTER TABLE public."BoundaryEvent" OWNER TO admin;

--
-- TOC entry 200 (class 1259 OID 16418)
-- Name: CatchEvent; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."CatchEvent" (
)
INHERITS (public."Event");


ALTER TABLE public."CatchEvent" OWNER TO admin;

--
-- TOC entry 201 (class 1259 OID 16426)
-- Name: EndEvent; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."EndEvent" (
)
INHERITS (public."Event");


ALTER TABLE public."EndEvent" OWNER TO admin;

--
-- TOC entry 202 (class 1259 OID 16434)
-- Name: ExclusiveGateway; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."ExclusiveGateway" (
    follow jsonb
)
INHERITS (public."NodeInstance");


ALTER TABLE public."ExclusiveGateway" OWNER TO admin;

--
-- TOC entry 203 (class 1259 OID 16442)
-- Name: FlowDef; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."FlowDef" (
    id uuid NOT NULL,
    name character varying,
    key character varying,
    "processDef" uuid,
    source uuid,
    target uuid,
    condition character varying,
    extensions jsonb,
    counter double precision
);


ALTER TABLE public."FlowDef" OWNER TO admin;

--
-- TOC entry 204 (class 1259 OID 16450)
-- Name: Lane; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."Lane" (
    id uuid NOT NULL,
    name character varying,
    key character varying,
    extensions jsonb,
    "processDef" uuid,
    counter double precision
);


ALTER TABLE public."Lane" OWNER TO admin;

--
-- TOC entry 205 (class 1259 OID 16458)
-- Name: NodeDef; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."NodeDef" (
    id uuid NOT NULL,
    name character varying,
    key character varying,
    "processDef" uuid,
    lane uuid,
    type character varying,
    extensions jsonb,
    "attachedToNode" uuid,
    events jsonb,
    script character varying,
    "eventType" character varying,
    "cancelActivity" boolean,
    "subProcessKey" character varying,
    "subProcessDef" uuid,
    counter double precision,
    "timerDefinitionType" double precision,
    "timerDefinition" character varying,
    "startContext" character varying,
    "startContextEntityType" character varying,
    signal character varying,
    message character varying,
    condition character varying,
    "errorName" character varying,
    "errorCode" character varying
);


ALTER TABLE public."NodeDef" OWNER TO admin;

--
-- TOC entry 206 (class 1259 OID 16466)
-- Name: ParallelGateway; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."ParallelGateway" (
    "parallelType" character varying
)
INHERITS (public."NodeInstance");


ALTER TABLE public."ParallelGateway" OWNER TO admin;

--
-- TOC entry 208 (class 1259 OID 16482)
-- Name: Process; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."Process" (
    id uuid NOT NULL,
    name character varying,
    key character varying,
    status character varying,
    "processDef" uuid,
    "isSubProcess" boolean,
    "callerId" character varying
);


ALTER TABLE public."Process" OWNER TO admin;

--
-- TOC entry 207 (class 1259 OID 16474)
-- Name: ProcessDef; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."ProcessDef" (
    id uuid NOT NULL,
    name character varying,
    key character varying,
    "defId" character varying,
    xml character varying,
    extensions jsonb,
    "internalName" character varying,
    path character varying,
    category character varying,
    module character varying,
    readonly boolean,
    version character varying,
    counter double precision,
    draft boolean,
    latest boolean
);


ALTER TABLE public."ProcessDef" OWNER TO admin;

--
-- TOC entry 209 (class 1259 OID 16490)
-- Name: ProcessToken; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."ProcessToken" (
    id uuid NOT NULL,
    data jsonb,
    process uuid
);


ALTER TABLE public."ProcessToken" OWNER TO admin;

--
-- TOC entry 210 (class 1259 OID 16498)
-- Name: ScriptTask; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."ScriptTask" (
    script character varying
)
INHERITS (public."NodeInstance");


ALTER TABLE public."ScriptTask" OWNER TO admin;

--
-- TOC entry 211 (class 1259 OID 16506)
-- Name: ServiceTask; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."ServiceTask" (
)
INHERITS (public."NodeInstance");


ALTER TABLE public."ServiceTask" OWNER TO admin;

--
-- TOC entry 212 (class 1259 OID 16514)
-- Name: SessionStore; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."SessionStore" (
    id uuid NOT NULL,
    "identityId" character varying,
    "systemUserId" character varying,
    data jsonb,
    roles jsonb
);


ALTER TABLE public."SessionStore" OWNER TO admin;

--
-- TOC entry 213 (class 1259 OID 16522)
-- Name: StartEvent; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."StartEvent" (
)
INHERITS (public."Event");


ALTER TABLE public."StartEvent" OWNER TO admin;

--
-- TOC entry 214 (class 1259 OID 16530)
-- Name: SubprocessExternal; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."SubprocessExternal" (
)
INHERITS (public."NodeInstance");


ALTER TABLE public."SubprocessExternal" OWNER TO admin;

--
-- TOC entry 215 (class 1259 OID 16538)
-- Name: SubprocessInternal; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."SubprocessInternal" (
)
INHERITS (public."NodeInstance");


ALTER TABLE public."SubprocessInternal" OWNER TO admin;

--
-- TOC entry 216 (class 1259 OID 16546)
-- Name: ThrowEvent; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."ThrowEvent" (
)
INHERITS (public."Event");


ALTER TABLE public."ThrowEvent" OWNER TO admin;

--
-- TOC entry 217 (class 1259 OID 16554)
-- Name: Timer; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."Timer" (
    id uuid NOT NULL,
    "timerType" double precision,
    "timerIsoString" character varying,
    "timerRule" jsonb,
    "eventName" character varying,
    "lastElapsed" timestamp without time zone
);


ALTER TABLE public."Timer" OWNER TO admin;

--
-- TOC entry 196 (class 1259 OID 16386)
-- Name: User; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."User" (
    id uuid NOT NULL,
    name character varying,
    password character varying,
    roles jsonb
);


ALTER TABLE public."User" OWNER TO admin;

--
-- TOC entry 218 (class 1259 OID 16562)
-- Name: UserTask; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."UserTask" (
)
INHERITS (public."NodeInstance");


ALTER TABLE public."UserTask" OWNER TO admin;

--
-- TOC entry 3017 (class 0 OID 16410)
-- Dependencies: 199
-- Data for Name: BoundaryEvent; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."BoundaryEvent" (id, name, key, process, "nodeDef", type, state, participant, application, "processToken", "instanceCounter") FROM stdin;
\.


--
-- TOC entry 3018 (class 0 OID 16418)
-- Dependencies: 200
-- Data for Name: CatchEvent; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."CatchEvent" (id, name, key, process, "nodeDef", type, state, participant, application, "processToken", "instanceCounter") FROM stdin;
\.


--
-- TOC entry 3019 (class 0 OID 16426)
-- Dependencies: 201
-- Data for Name: EndEvent; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."EndEvent" (id, name, key, process, "nodeDef", type, state, participant, application, "processToken", "instanceCounter") FROM stdin;
\.


--
-- TOC entry 3016 (class 0 OID 16402)
-- Dependencies: 198
-- Data for Name: Event; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."Event" (id, name, key, process, "nodeDef", type, state, participant, application, "processToken", "instanceCounter") FROM stdin;
\.


--
-- TOC entry 3020 (class 0 OID 16434)
-- Dependencies: 202
-- Data for Name: ExclusiveGateway; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."ExclusiveGateway" (id, name, key, process, "nodeDef", type, state, participant, application, "processToken", "instanceCounter", follow) FROM stdin;
\.


--
-- TOC entry 3021 (class 0 OID 16442)
-- Dependencies: 203
-- Data for Name: FlowDef; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."FlowDef" (id, name, key, "processDef", source, target, condition, extensions, counter) FROM stdin;
c7b260e1-1e2b-4f69-a26b-345f6e189957	\N	SequenceFlow_158r0rn	fa9860d2-bdae-4806-a0e0-687be116485d	6ca85a3c-aa02-4e8f-9cbb-3062359d9903	488e4f93-3929-4f4e-a40e-b6f763f432f4	\N	\N	1
d9dd26d0-9734-4535-b3d0-c8cee03df7e7	\N	SequenceFlow_1pljw1v	fa9860d2-bdae-4806-a0e0-687be116485d	eb915fab-b399-4132-82c4-02a00a9a9c4a	6ca85a3c-aa02-4e8f-9cbb-3062359d9903	\N	\N	1
cd181aa3-6966-4dce-9723-6bd30b6b9cbc	\N	SequenceFlow_1fu735p	fa9860d2-bdae-4806-a0e0-687be116485d	e5e6daae-aa14-4feb-9da5-18481e84137c	9c78f5cb-1697-4688-aabb-abecb12c0a47	\N	\N	1
fce15f93-ae97-4201-82b9-3b31f34c96f6	\N	SequenceFlow_1e6wtlb	fa9860d2-bdae-4806-a0e0-687be116485d	9c78f5cb-1697-4688-aabb-abecb12c0a47	41f60826-ff79-427a-bc8f-7a6adbcddb53	\N	\N	1
bff896f2-3907-48a5-9de7-6e1cb11f2cb8	NOK\n	SequenceFlow_0f62hcj	fa9860d2-bdae-4806-a0e0-687be116485d	488e4f93-3929-4f4e-a40e-b6f763f432f4	24c4a66d-72c4-4f58-bb09-1b4981e6eccd	!this.current.name || !this.current.key	\N	1
74688213-0320-4716-8ab7-7a35ed665e97	\N	SequenceFlow_0cdliq9	fa9860d2-bdae-4806-a0e0-687be116485d	24c4a66d-72c4-4f58-bb09-1b4981e6eccd	e947be23-54e2-4927-a737-2703575608fb	\N	\N	1
af66c96d-2b00-4d85-991b-f57647f3f1e3	OK	SequenceFlow_1jrjh1u	fa9860d2-bdae-4806-a0e0-687be116485d	488e4f93-3929-4f4e-a40e-b6f763f432f4	e5e6daae-aa14-4feb-9da5-18481e84137c	this.current.name && this.current.key	{"properties": [{"name": "mapper", "$type": "camunda:property", "value": "{name: token.history.ut_SetData.name, key: token.history.ut_SetData.key, latest:false, draft:true}"}]}	1
1fc2041b-a88b-43d3-ad75-e46b24d74793	\N	SequenceFlow_0bcalzv	5fe0df19-ef12-4324-984b-3f462da99128	bf850e28-ff2a-4e44-abb4-b9facaec948a	52eea959-7508-4b99-a55d-ffd672ae6666	\N	\N	1
ce93266b-739e-4a26-9cfe-1b48e6d877cd	\N	SequenceFlow_1ejjcqo	5fe0df19-ef12-4324-984b-3f462da99128	52eea959-7508-4b99-a55d-ffd672ae6666	fed8c854-c746-4c02-ab49-9f8077a70f7c	\N	\N	1
ab815a5f-b1c5-47f8-b0b3-d600346a1cbd	nicht entfernen	SequenceFlow_0otvn59	5fe0df19-ef12-4324-984b-3f462da99128	fed8c854-c746-4c02-ab49-9f8077a70f7c	d0a32641-9b9f-4131-b66b-3897fefc61dc	this.current.key !== 'confirm'	\N	1
6b5c1e34-0da6-4fcf-a096-8311637db955	entfernen\n	SequenceFlow_1ptibf2	5fe0df19-ef12-4324-984b-3f462da99128	fed8c854-c746-4c02-ab49-9f8077a70f7c	6a1ebe7e-6f42-43a3-b007-774075c0e305	this.current.key === 'confirm'	\N	1
f236090b-c5d8-432d-8ef3-8cbd3b653339	\N	SequenceFlow_1v963lh	5fe0df19-ef12-4324-984b-3f462da99128	6a1ebe7e-6f42-43a3-b007-774075c0e305	f1762af5-749b-4ebc-85be-292d8bc9c496	\N	\N	1
f5472554-ef15-4d10-8bc0-d835b1c55351	\N	SequenceFlow_0njyz0c	61aae60a-ff74-460c-a7b3-10f705b463b8	bb876ea7-804c-4579-b748-81a994d7c427	dcf881c0-e920-4d4c-9dca-3af9c0b5aada	\N	\N	1
1a597e1f-f2a1-4c0a-ad7a-9039c7689d59	\N	SequenceFlow_08ky93g	61aae60a-ff74-460c-a7b3-10f705b463b8	dcf881c0-e920-4d4c-9dca-3af9c0b5aada	139f8aaa-3b7c-426c-a329-262d876d328d	\N	\N	1
88d33a09-36bd-41db-8b98-9bc29c78fb42	\N	SequenceFlow_13pkx0l	61aae60a-ff74-460c-a7b3-10f705b463b8	258fe161-64ed-4411-b5da-6174e337af06	57f98e6e-fb3d-4cf8-98ab-20298fa22173	\N	\N	1
509236ba-5dce-4c86-a66d-4bf17df995bc	\N	SequenceFlow_0gq1iy1	61aae60a-ff74-460c-a7b3-10f705b463b8	dc171a36-8154-47bc-982a-d791795a9ca8	3c1f12fd-b8da-47ad-b9c7-442c54fe1a1f	\N	\N	1
3173c1a3-23e8-4c1c-9702-fc67dd568315	\N	SequenceFlow_17p3vrj	61aae60a-ff74-460c-a7b3-10f705b463b8	57f98e6e-fb3d-4cf8-98ab-20298fa22173	dc171a36-8154-47bc-982a-d791795a9ca8	\N	\N	1
4aee7f6c-077a-4212-874e-0c93d42fcd7a	\N	SequenceFlow_0c4x2ue	61aae60a-ff74-460c-a7b3-10f705b463b8	57f98e6e-fb3d-4cf8-98ab-20298fa22173	b91fb95e-5fb5-4e5b-8b4b-526563f92954	\N	\N	1
1b477037-e64e-4e60-b122-a3571ee56b80	\N	SequenceFlow_0l0ozof	61aae60a-ff74-460c-a7b3-10f705b463b8	b91fb95e-5fb5-4e5b-8b4b-526563f92954	b13a8775-63aa-4f41-9d12-06ce8889f030	\N	\N	1
e9206179-cba4-44ec-9799-bdda99f9c16f	\N	SequenceFlow_0vspoh6	cd759de6-9b6c-435a-b6ab-f637780238e0	0bdc9594-bc1d-4856-81c6-fec838494ce7	94c0ef4b-e94e-4716-be0f-c2cace3040d0	\N	\N	1
0e4db5a4-37fe-488c-b17c-0d84f08a84ca		SequenceFlow_0s3n7ck	cd759de6-9b6c-435a-b6ab-f637780238e0	94c0ef4b-e94e-4716-be0f-c2cace3040d0	e91378d7-7f73-4606-96db-9ece717af6bf	token.history.StartEvent_1.causeError === true	\N	1
fbb7e3e3-33c6-45ec-809e-ce306fb24b18		SequenceFlow_0dbx7lk	cd759de6-9b6c-435a-b6ab-f637780238e0	94c0ef4b-e94e-4716-be0f-c2cace3040d0	236b8fb9-9621-4347-b86c-569e2ee81170	token.history.StartEvent_1.causeError !== true	\N	1
dc293526-d487-42e2-8ec0-aba8e31b72ab	\N	SequenceFlow_0dqpbny	cd759de6-9b6c-435a-b6ab-f637780238e0	236b8fb9-9621-4347-b86c-569e2ee81170	ec9fa48b-9050-424c-8350-1aeb5660b7f7	\N	{"properties": [{"name": "mapper", "$type": "camunda:property", "value": "\\"EndEvent_Success\\""}]}	1
6cb5e4a7-9b8a-4ada-9de6-eb4c70a4b701	\N	SequenceFlow_0aopc8s	cd759de6-9b6c-435a-b6ab-f637780238e0	e91378d7-7f73-4606-96db-9ece717af6bf	0b2f1e14-85d9-49f4-90b5-473b2124f1d2	\N	\N	1
e00e57c6-dd47-49be-9f3a-d7ec7ad9f1b8	\N	SequenceFlow_0fkan76	6b12396f-46bd-4ad5-b616-0fb11138b24a	86d20963-1f4d-4a4c-8bce-e28293fe218f	fb70c53f-d4b4-4364-8e2e-e78d85615ba9	\N	\N	1
dee71bd2-d20f-4957-a18e-4d580669fc9b	\N	SequenceFlow_00nxkwz	6b12396f-46bd-4ad5-b616-0fb11138b24a	fb70c53f-d4b4-4364-8e2e-e78d85615ba9	34cec951-b8ec-484d-9ceb-77ae7ec22c69	\N	\N	1
\.


--
-- TOC entry 3022 (class 0 OID 16450)
-- Dependencies: 204
-- Data for Name: Lane; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."Lane" (id, name, key, extensions, "processDef", counter) FROM stdin;
e7157108-fa04-4712-a657-54d2b658adef	Agent	Lane_1g91j0d	\N	fa9860d2-bdae-4806-a0e0-687be116485d	1
b378c898-f69e-4054-83f9-1cd8d2fdcb43	Agent	Lane_1efnqeo	\N	5fe0df19-ef12-4324-984b-3f462da99128	1
13f4d499-a6f0-41a7-8f19-46d8a8ca61e2	Lane A	Lane_1xzf0d3	{"properties": [{"name": "role", "$type": "camunda:property", "value": "123"}]}	61aae60a-ff74-460c-a7b3-10f705b463b8	1
3a5c837c-3568-4cdd-8a47-f26b73134da9	can_start_process	Lane_1xzf0d3	{"properties": [{"name": "role", "$type": "camunda:property", "value": "user"}]}	cd759de6-9b6c-435a-b6ab-f637780238e0	1
ecfaf217-dfce-4a28-87a1-6248ba08f22a	can_view_usertask	Lane_1xzf0d3	\N	6b12396f-46bd-4ad5-b616-0fb11138b24a	1
\.


--
-- TOC entry 3023 (class 0 OID 16458)
-- Dependencies: 205
-- Data for Name: NodeDef; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."NodeDef" (id, name, key, "processDef", lane, type, extensions, "attachedToNode", events, script, "eventType", "cancelActivity", "subProcessKey", "subProcessDef", counter, "timerDefinitionType", "timerDefinition", "startContext", "startContextEntityType", signal, message, condition, "errorName", "errorCode") FROM stdin;
6ca85a3c-aa02-4e8f-9cbb-3062359d9903	Initiale Prozessdaten eingeben	ut_SetData	fa9860d2-bdae-4806-a0e0-687be116485d	e7157108-fa04-4712-a657-54d2b658adef	bpmn:UserTask	{"formFields": [{"id": "name", "type": "string", "$type": "camunda:formField", "label": "Name", "formValues": [], "formProperties": [{"name": "test", "$type": "camunda:property", "value": "123"}]}, {"id": "key", "type": "string", "$type": "camunda:formField", "label": "Schlüssel", "formValues": [], "formProperties": [{"name": "test", "$type": "camunda:property", "value": "123"}]}], "properties": [{"name": "uiName", "$type": "camunda:property", "value": "Form"}]}	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N
488e4f93-3929-4f4e-a40e-b6f763f432f4	Daten prüfen	ExclusiveGateway_01df7jg	fa9860d2-bdae-4806-a0e0-687be116485d	e7157108-fa04-4712-a657-54d2b658adef	bpmn:ExclusiveGateway	\N	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N
e947be23-54e2-4927-a737-2703575608fb	\N	EndEvent_0ptvnel	fa9860d2-bdae-4806-a0e0-687be116485d	e7157108-fa04-4712-a657-54d2b658adef	bpmn:EndEvent	\N	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N
24c4a66d-72c4-4f58-bb09-1b4981e6eccd	Prozess NICHT erstellt	Task_18mpw1t	fa9860d2-bdae-4806-a0e0-687be116485d	e7157108-fa04-4712-a657-54d2b658adef	bpmn:UserTask	{"properties": [{"name": "uiName", "$type": "camunda:property", "value": "Confirm"}, {"name": "uiConfig", "$type": "camunda:property", "value": "${ \\"message\\": \\"Der Prozess wurde nicht erstellt (Daten inkorrekt)!\\", \\"layout\\": [ { \\"key\\": \\"confirm\\", \\"label\\": \\"OK\\" } ] };"}]}	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N
9c78f5cb-1697-4688-aabb-abecb12c0a47	Prozess erstellt	Task_1qwsbir	fa9860d2-bdae-4806-a0e0-687be116485d	e7157108-fa04-4712-a657-54d2b658adef	bpmn:UserTask	{"properties": [{"name": "uiName", "$type": "camunda:property", "value": "Confirm"}, {"name": "uiConfig", "$type": "camunda:property", "value": "${ \\"message\\": \\"Der Prozess wurde erfolgreich erstellt!\\", \\"layout\\": [ { \\"key\\": \\"confirm\\", \\"label\\": \\"OK\\" } ] };"}]}	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N
eb915fab-b399-4132-82c4-02a00a9a9c4a	Erstelle Prozess	StartEvent_1	fa9860d2-bdae-4806-a0e0-687be116485d	e7157108-fa04-4712-a657-54d2b658adef	bpmn:StartEvent	\N	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N
41f60826-ff79-427a-bc8f-7a6adbcddb53	\N	EndEvent_01j9qze	fa9860d2-bdae-4806-a0e0-687be116485d	e7157108-fa04-4712-a657-54d2b658adef	bpmn:EndEvent	\N	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N
e5e6daae-aa14-4feb-9da5-18481e84137c	Prozess speichern	Task_1nf7w5s	fa9860d2-bdae-4806-a0e0-687be116485d	e7157108-fa04-4712-a657-54d2b658adef	bpmn:ServiceTask	{"properties": [{"name": "module", "$type": "camunda:property", "value": "DatastoreService"}, {"name": "method", "$type": "camunda:property", "value": "saveNewEntity"}, {"name": "params", "$type": "camunda:property", "value": "['ProcessDef', this.current, context]"}]}	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N
bf850e28-ff2a-4e44-abb4-b9facaec948a	Lösche Prozess	StartEvent	5fe0df19-ef12-4324-984b-3f462da99128	b378c898-f69e-4054-83f9-1cd8d2fdcb43	bpmn:StartEvent	\N	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N
fed8c854-c746-4c02-ab49-9f8077a70f7c	Bestätigung prüfen	ExclusiveGateway_0e9znwu	5fe0df19-ef12-4324-984b-3f462da99128	b378c898-f69e-4054-83f9-1cd8d2fdcb43	bpmn:ExclusiveGateway	\N	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N
d0a32641-9b9f-4131-b66b-3897fefc61dc	\N	EndEvent_0q0x49e	5fe0df19-ef12-4324-984b-3f462da99128	b378c898-f69e-4054-83f9-1cd8d2fdcb43	bpmn:EndEvent	\N	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N
6a1ebe7e-6f42-43a3-b007-774075c0e305	Prozess löschen	Task_01b43wb	5fe0df19-ef12-4324-984b-3f462da99128	b378c898-f69e-4054-83f9-1cd8d2fdcb43	bpmn:ServiceTask	{"properties": [{"name": "module", "$type": "camunda:property", "value": "DatastoreService"}, {"name": "method", "$type": "camunda:property", "value": "removeEntity"}, {"name": "params", "$type": "camunda:property", "value": "['ProcessDef', token.history.StartEvent.id, context]"}]}	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N
f1762af5-749b-4ebc-85be-292d8bc9c496	\N	EndEvent_1mibekw	5fe0df19-ef12-4324-984b-3f462da99128	b378c898-f69e-4054-83f9-1cd8d2fdcb43	bpmn:EndEvent	\N	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N
52eea959-7508-4b99-a55d-ffd672ae6666	Löschen bestätigen	Task_1ck7in7	5fe0df19-ef12-4324-984b-3f462da99128	b378c898-f69e-4054-83f9-1cd8d2fdcb43	bpmn:UserTask	{"properties": [{"name": "uiName", "$type": "camunda:property", "value": "Confirm"}, {"name": "uiConfig", "$type": "camunda:property", "value": "${ \\"message\\": \\"Soll der Prozess wirklich gelöscht werden?\\", \\"layout\\": [ { \\"key\\": \\"cancel\\", \\"label\\": \\"Abbrechen\\" }, { \\"key\\": \\"confirm\\", \\"label\\": \\"Löschen\\" } ] };"}]}	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N
258fe161-64ed-4411-b5da-6174e337af06		StartEvent_0yfvdj3	61aae60a-ff74-460c-a7b3-10f705b463b8	13f4d499-a6f0-41a7-8f19-46d8a8ca61e2	bpmn:StartEvent	\N	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N
3c1f12fd-b8da-47ad-b9c7-442c54fe1a1f		EndEvent_1val5zu	61aae60a-ff74-460c-a7b3-10f705b463b8	13f4d499-a6f0-41a7-8f19-46d8a8ca61e2	bpmn:EndEvent	\N	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N
dc171a36-8154-47bc-982a-d791795a9ca8	UT1	Task_0l3cpkx	61aae60a-ff74-460c-a7b3-10f705b463b8	13f4d499-a6f0-41a7-8f19-46d8a8ca61e2	bpmn:UserTask	{"formFields": [{"id": "Form_TlgO8xvn", "type": "enum", "$type": "camunda:formField", "label": "", "formValues": [], "defaultValue": "", "formProperties": []}]}	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N
57f98e6e-fb3d-4cf8-98ab-20298fa22173	\N	ExclusiveGateway_0m2ork1	61aae60a-ff74-460c-a7b3-10f705b463b8	13f4d499-a6f0-41a7-8f19-46d8a8ca61e2	bpmn:ExclusiveGateway	\N	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N
dcf881c0-e920-4d4c-9dca-3af9c0b5aada	UT2	Task_11ng559	61aae60a-ff74-460c-a7b3-10f705b463b8	13f4d499-a6f0-41a7-8f19-46d8a8ca61e2	bpmn:UserTask	{"formFields": [{"id": "Form_dz2ZcHjt", "type": "string", "$type": "camunda:formField", "label": "asd", "formValues": [], "defaultValue": "asdasd", "formProperties": []}], "properties": [{"name": "uiName", "$type": "camunda:property", "value": "Form"}]}	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N
139f8aaa-3b7c-426c-a329-262d876d328d		EndEvent_16w6fr2	61aae60a-ff74-460c-a7b3-10f705b463b8	13f4d499-a6f0-41a7-8f19-46d8a8ca61e2	bpmn:EndEvent	\N	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N
bb876ea7-804c-4579-b748-81a994d7c427	consumer_api_lane_test	StartEvent_1	61aae60a-ff74-460c-a7b3-10f705b463b8	13f4d499-a6f0-41a7-8f19-46d8a8ca61e2	bpmn:StartEvent	\N	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N
b91fb95e-5fb5-4e5b-8b4b-526563f92954		Task_10gpc45	61aae60a-ff74-460c-a7b3-10f705b463b8	13f4d499-a6f0-41a7-8f19-46d8a8ca61e2	bpmn:CallActivity	\N	\N	\N	\N	\N	\N	consumer_api_usertask_test	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N
b13a8775-63aa-4f41-9d12-06ce8889f030	\N	EndEvent_0gtl02k	61aae60a-ff74-460c-a7b3-10f705b463b8	13f4d499-a6f0-41a7-8f19-46d8a8ca61e2	bpmn:EndEvent	\N	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N
e91378d7-7f73-4606-96db-9ece717af6bf	Simulate Process Error	scriptTask_SimulateProcessError	cd759de6-9b6c-435a-b6ab-f637780238e0	3a5c837c-3568-4cdd-8a47-f26b73134da9	bpmn:ScriptTask	{"properties": []}	\N	\N	throw new Error('Critical error during task!');	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N
236b8fb9-9621-4347-b86c-569e2ee81170	Write Log	scriptTask_WriteConsoleLog	cd759de6-9b6c-435a-b6ab-f637780238e0	3a5c837c-3568-4cdd-8a47-f26b73134da9	bpmn:ScriptTask	\N	\N	\N	console.log('Successfully started the process!');	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N
ec9fa48b-9050-424c-8350-1aeb5660b7f7		EndEvent_Success	cd759de6-9b6c-435a-b6ab-f637780238e0	3a5c837c-3568-4cdd-8a47-f26b73134da9	bpmn:EndEvent	\N	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N
0b2f1e14-85d9-49f4-90b5-473b2124f1d2		EndEvent_Error	cd759de6-9b6c-435a-b6ab-f637780238e0	3a5c837c-3568-4cdd-8a47-f26b73134da9	bpmn:EndEvent	\N	\N	\N	\N	bpmn:ErrorEventDefinition	t	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N
94c0ef4b-e94e-4716-be0f-c2cace3040d0		ExclusiveGateway_0bnj53e	cd759de6-9b6c-435a-b6ab-f637780238e0	3a5c837c-3568-4cdd-8a47-f26b73134da9	bpmn:ExclusiveGateway	\N	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N
0bdc9594-bc1d-4856-81c6-fec838494ce7	test_consumer_api_process_start	StartEvent_1	cd759de6-9b6c-435a-b6ab-f637780238e0	3a5c837c-3568-4cdd-8a47-f26b73134da9	bpmn:StartEvent	\N	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N
86d20963-1f4d-4a4c-8bce-e28293fe218f	consumer_api_usertask_test	StartEvent_1	6b12396f-46bd-4ad5-b616-0fb11138b24a	ecfaf217-dfce-4a28-87a1-6248ba08f22a	bpmn:StartEvent	\N	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N
fb70c53f-d4b4-4364-8e2e-e78d85615ba9		Task_1vdwmn1	6b12396f-46bd-4ad5-b616-0fb11138b24a	ecfaf217-dfce-4a28-87a1-6248ba08f22a	bpmn:UserTask	{"formFields": [{"id": "Form_XGSVBgio", "type": "boolean", "$type": "camunda:formField", "label": "", "formValues": [], "defaultValue": "", "formProperties": []}]}	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N
34cec951-b8ec-484d-9ceb-77ae7ec22c69	\N	EndEvent_1j67qnl	6b12396f-46bd-4ad5-b616-0fb11138b24a	ecfaf217-dfce-4a28-87a1-6248ba08f22a	bpmn:EndEvent	\N	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N
\.


--
-- TOC entry 3015 (class 0 OID 16394)
-- Dependencies: 197
-- Data for Name: NodeInstance; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."NodeInstance" (id, name, key, process, "nodeDef", type, state, participant, application, "processToken", "instanceCounter") FROM stdin;
\.


--
-- TOC entry 3024 (class 0 OID 16466)
-- Dependencies: 206
-- Data for Name: ParallelGateway; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."ParallelGateway" (id, name, key, process, "nodeDef", type, state, participant, application, "processToken", "instanceCounter", "parallelType") FROM stdin;
\.


--
-- TOC entry 3026 (class 0 OID 16482)
-- Dependencies: 208
-- Data for Name: Process; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."Process" (id, name, key, status, "processDef", "isSubProcess", "callerId") FROM stdin;
\.


--
-- TOC entry 3025 (class 0 OID 16474)
-- Dependencies: 207
-- Data for Name: ProcessDef; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."ProcessDef" (id, name, key, "defId", xml, extensions, "internalName", path, category, module, readonly, version, counter, draft, latest) FROM stdin;
fa9860d2-bdae-4806-a0e0-687be116485d	Prozess erstellen	CreateProcessDef	Definitions_1	<?xml version="1.0" encoding="UTF-8"?>\n<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn" exporter="Camunda Modeler" exporterVersion="1.10.0">\n  <bpmn:collaboration id="Collaboration_1o0zlqs">\n    <bpmn:participant id="Participant_0us40cv" name="Prozess erstellen" processRef="CreateProcessDef" />\n  </bpmn:collaboration>\n  <bpmn:process id="CreateProcessDef" name="Prozess erstellen" isExecutable="false" camunda:versionTag="1.0.0">\n    <bpmn:extensionElements>\n      <camunda:properties>\n        <camunda:property name="persist" value="false" />\n      </camunda:properties>\n    </bpmn:extensionElements>\n    <bpmn:laneSet>\n      <bpmn:lane id="Lane_1g91j0d" name="Agent">\n        <bpmn:flowNodeRef>ut_SetData</bpmn:flowNodeRef>\n        <bpmn:flowNodeRef>ExclusiveGateway_01df7jg</bpmn:flowNodeRef>\n        <bpmn:flowNodeRef>EndEvent_0ptvnel</bpmn:flowNodeRef>\n        <bpmn:flowNodeRef>Task_18mpw1t</bpmn:flowNodeRef>\n        <bpmn:flowNodeRef>Task_1nf7w5s</bpmn:flowNodeRef>\n        <bpmn:flowNodeRef>Task_1qwsbir</bpmn:flowNodeRef>\n        <bpmn:flowNodeRef>EndEvent_01j9qze</bpmn:flowNodeRef>\n        <bpmn:flowNodeRef>StartEvent_1</bpmn:flowNodeRef>\n      </bpmn:lane>\n    </bpmn:laneSet>\n    <bpmn:userTask id="ut_SetData" name="Initiale Prozessdaten eingeben">\n      <bpmn:extensionElements>\n        <camunda:formData>\n          <camunda:formField id="name" label="Name" type="string">\n            <camunda:properties>\n              <camunda:property id="test" value="123" />\n            </camunda:properties>\n          </camunda:formField>\n          <camunda:formField id="key" label="Schlüssel" type="string">\n            <camunda:properties>\n              <camunda:property id="test" value="123" />\n            </camunda:properties>\n          </camunda:formField>\n        </camunda:formData>\n        <camunda:properties>\n          <camunda:property name="uiName" value="Form" />\n        </camunda:properties>\n      </bpmn:extensionElements>\n      <bpmn:incoming>SequenceFlow_1pljw1v</bpmn:incoming>\n      <bpmn:outgoing>SequenceFlow_158r0rn</bpmn:outgoing>\n    </bpmn:userTask>\n    <bpmn:exclusiveGateway id="ExclusiveGateway_01df7jg" name="Daten prüfen">\n      <bpmn:incoming>SequenceFlow_158r0rn</bpmn:incoming>\n      <bpmn:outgoing>SequenceFlow_1jrjh1u</bpmn:outgoing>\n      <bpmn:outgoing>SequenceFlow_0f62hcj</bpmn:outgoing>\n    </bpmn:exclusiveGateway>\n    <bpmn:endEvent id="EndEvent_0ptvnel">\n      <bpmn:incoming>SequenceFlow_0cdliq9</bpmn:incoming>\n    </bpmn:endEvent>\n    <bpmn:sequenceFlow id="SequenceFlow_1pljw1v" sourceRef="StartEvent_1" targetRef="ut_SetData" />\n    <bpmn:sequenceFlow id="SequenceFlow_158r0rn" sourceRef="ut_SetData" targetRef="ExclusiveGateway_01df7jg" />\n    <bpmn:sequenceFlow id="SequenceFlow_1jrjh1u" name="OK" sourceRef="ExclusiveGateway_01df7jg" targetRef="Task_1nf7w5s">\n      <bpmn:extensionElements>\n        <camunda:properties>\n          <camunda:property name="mapper" value="{name: token.history.ut_SetData.name, key: token.history.ut_SetData.key, latest:false, draft:true}" />\n        </camunda:properties>\n      </bpmn:extensionElements>\n      <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression"><![CDATA[this.current.name && this.current.key]]></bpmn:conditionExpression>\n    </bpmn:sequenceFlow>\n    <bpmn:sequenceFlow id="SequenceFlow_1fu735p" sourceRef="Task_1nf7w5s" targetRef="Task_1qwsbir" />\n    <bpmn:sequenceFlow id="SequenceFlow_0f62hcj" name="NOK&#10;" sourceRef="ExclusiveGateway_01df7jg" targetRef="Task_18mpw1t">\n      <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression">!this.current.name || !this.current.key</bpmn:conditionExpression>\n    </bpmn:sequenceFlow>\n    <bpmn:sequenceFlow id="SequenceFlow_1e6wtlb" sourceRef="Task_1qwsbir" targetRef="EndEvent_01j9qze" />\n    <bpmn:sequenceFlow id="SequenceFlow_0cdliq9" sourceRef="Task_18mpw1t" targetRef="EndEvent_0ptvnel" />\n    <bpmn:userTask id="Task_18mpw1t" name="Prozess NICHT erstellt">\n      <bpmn:extensionElements>\n        <camunda:properties>\n          <camunda:property name="uiName" value="Confirm" />\n          <camunda:property name="uiConfig" value="${ &#34;message&#34;: &#34;Der Prozess wurde nicht erstellt (Daten inkorrekt)!&#34;, &#34;layout&#34;: [ { &#34;key&#34;: &#34;confirm&#34;, &#34;label&#34;: &#34;OK&#34; } ] };" />\n        </camunda:properties>\n      </bpmn:extensionElements>\n      <bpmn:incoming>SequenceFlow_0f62hcj</bpmn:incoming>\n      <bpmn:outgoing>SequenceFlow_0cdliq9</bpmn:outgoing>\n    </bpmn:userTask>\n    <bpmn:serviceTask id="Task_1nf7w5s" name="Prozess speichern">\n      <bpmn:extensionElements>\n        <camunda:properties>\n          <camunda:property name="module" value="DatastoreService" />\n          <camunda:property name="method" value="saveNewEntity" />\n          <camunda:property name="params" value="[&#39;ProcessDef&#39;, this.current, context]" />\n        </camunda:properties>\n      </bpmn:extensionElements>\n      <bpmn:incoming>SequenceFlow_1jrjh1u</bpmn:incoming>\n      <bpmn:outgoing>SequenceFlow_1fu735p</bpmn:outgoing>\n    </bpmn:serviceTask>\n    <bpmn:userTask id="Task_1qwsbir" name="Prozess erstellt">\n      <bpmn:extensionElements>\n        <camunda:properties>\n          <camunda:property name="uiName" value="Confirm" />\n          <camunda:property name="uiConfig" value="${ &#34;message&#34;: &#34;Der Prozess wurde erfolgreich erstellt!&#34;, &#34;layout&#34;: [ { &#34;key&#34;: &#34;confirm&#34;, &#34;label&#34;: &#34;OK&#34; } ] };" />\n        </camunda:properties>\n      </bpmn:extensionElements>\n      <bpmn:incoming>SequenceFlow_1fu735p</bpmn:incoming>\n      <bpmn:outgoing>SequenceFlow_1e6wtlb</bpmn:outgoing>\n    </bpmn:userTask>\n    <bpmn:endEvent id="EndEvent_01j9qze">\n      <bpmn:incoming>SequenceFlow_1e6wtlb</bpmn:incoming>\n    </bpmn:endEvent>\n    <bpmn:startEvent id="StartEvent_1" name="Erstelle Prozess">\n      <bpmn:outgoing>SequenceFlow_1pljw1v</bpmn:outgoing>\n    </bpmn:startEvent>\n  </bpmn:process>\n  <bpmndi:BPMNDiagram id="BPMNDiagram_1">\n    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Collaboration_1o0zlqs">\n      <bpmndi:BPMNShape id="Participant_0us40cv_di" bpmnElement="Participant_0us40cv">\n        <dc:Bounds x="185" y="74" width="810" height="315" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">\n        <dc:Bounds x="283" y="172" width="36" height="36" />\n        <bpmndi:BPMNLabel>\n          <dc:Bounds x="261" y="208" width="80" height="13" />\n        </bpmndi:BPMNLabel>\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNEdge id="SequenceFlow_1pljw1v_di" bpmnElement="SequenceFlow_1pljw1v">\n        <di:waypoint xsi:type="dc:Point" x="319" y="190" />\n        <di:waypoint xsi:type="dc:Point" x="386" y="190" />\n        <bpmndi:BPMNLabel>\n          <dc:Bounds x="307.5" y="168.5" width="90" height="13" />\n        </bpmndi:BPMNLabel>\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id="SequenceFlow_1jrjh1u_di" bpmnElement="SequenceFlow_1jrjh1u">\n        <di:waypoint xsi:type="dc:Point" x="562" y="215" />\n        <di:waypoint xsi:type="dc:Point" x="562" y="284" />\n        <bpmndi:BPMNLabel>\n          <dc:Bounds x="569" y="238" width="16" height="13" />\n        </bpmndi:BPMNLabel>\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNShape id="Lane_1g91j0d_di" bpmnElement="Lane_1g91j0d">\n        <dc:Bounds x="215" y="74" width="780" height="315" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id="UserTask_0ntr99e_di" bpmnElement="ut_SetData">\n        <dc:Bounds x="386" y="150" width="100" height="80" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id="EndEvent_01j9qze_di" bpmnElement="EndEvent_01j9qze">\n        <dc:Bounds x="913" y="306" width="36" height="36" />\n        <bpmndi:BPMNLabel>\n          <dc:Bounds x="886" y="345" width="90" height="13" />\n        </bpmndi:BPMNLabel>\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNEdge id="SequenceFlow_1fu735p_di" bpmnElement="SequenceFlow_1fu735p">\n        <di:waypoint xsi:type="dc:Point" x="612" y="324" />\n        <di:waypoint xsi:type="dc:Point" x="672" y="324" />\n        <di:waypoint xsi:type="dc:Point" x="672" y="324" />\n        <di:waypoint xsi:type="dc:Point" x="731" y="324" />\n        <bpmndi:BPMNLabel>\n          <dc:Bounds x="642" y="317.5" width="90" height="13" />\n        </bpmndi:BPMNLabel>\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNShape id="ServiceTask_0a8p3fc_di" bpmnElement="Task_1nf7w5s">\n        <dc:Bounds x="512" y="284" width="100" height="80" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id="ExclusiveGateway_01df7jg_di" bpmnElement="ExclusiveGateway_01df7jg" isMarkerVisible="true">\n        <dc:Bounds x="537" y="165" width="50" height="50" />\n        <bpmndi:BPMNLabel>\n          <dc:Bounds x="530" y="142" width="64" height="13" />\n        </bpmndi:BPMNLabel>\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNEdge id="SequenceFlow_158r0rn_di" bpmnElement="SequenceFlow_158r0rn">\n        <di:waypoint xsi:type="dc:Point" x="486" y="190" />\n        <di:waypoint xsi:type="dc:Point" x="537" y="190" />\n        <bpmndi:BPMNLabel>\n          <dc:Bounds x="467" y="169" width="90" height="13" />\n        </bpmndi:BPMNLabel>\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNShape id="EndEvent_0ptvnel_di" bpmnElement="EndEvent_0ptvnel">\n        <dc:Bounds x="913" y="172" width="36" height="36" />\n        <bpmndi:BPMNLabel>\n          <dc:Bounds x="886" y="211" width="90" height="13" />\n        </bpmndi:BPMNLabel>\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNEdge id="SequenceFlow_0f62hcj_di" bpmnElement="SequenceFlow_0f62hcj">\n        <di:waypoint xsi:type="dc:Point" x="587" y="190" />\n        <di:waypoint xsi:type="dc:Point" x="731" y="190" />\n        <bpmndi:BPMNLabel>\n          <dc:Bounds x="648.0000157232704" y="168" width="24" height="25" />\n        </bpmndi:BPMNLabel>\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id="SequenceFlow_0cdliq9_di" bpmnElement="SequenceFlow_0cdliq9">\n        <di:waypoint xsi:type="dc:Point" x="831" y="190" />\n        <di:waypoint xsi:type="dc:Point" x="913" y="190" />\n        <bpmndi:BPMNLabel>\n          <dc:Bounds x="827" y="168.5" width="90" height="13" />\n        </bpmndi:BPMNLabel>\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id="SequenceFlow_1e6wtlb_di" bpmnElement="SequenceFlow_1e6wtlb">\n        <di:waypoint xsi:type="dc:Point" x="831" y="324" />\n        <di:waypoint xsi:type="dc:Point" x="872" y="324" />\n        <di:waypoint xsi:type="dc:Point" x="872" y="324" />\n        <di:waypoint xsi:type="dc:Point" x="913" y="324" />\n        <bpmndi:BPMNLabel>\n          <dc:Bounds x="842" y="317.5" width="90" height="13" />\n        </bpmndi:BPMNLabel>\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNShape id="UserTask_0s4t8hc_di" bpmnElement="Task_18mpw1t">\n        <dc:Bounds x="731" y="150" width="100" height="80" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id="UserTask_0vvskx3_di" bpmnElement="Task_1qwsbir">\n        <dc:Bounds x="731" y="284" width="100" height="80" />\n      </bpmndi:BPMNShape>\n    </bpmndi:BPMNPlane>\n  </bpmndi:BPMNDiagram>\n</bpmn:definitions>\n	{"properties": [{"name": "persist", "$type": "camunda:property", "value": "false"}]}	createProcessDef.bpmn	/Users/heiko/Desktop/Projekte/BPMN/consumer_api_meta/node_modules/@process-engine/process_repository/bpmn/createProcessDef.bpmn	internal	process_engine	\N	1.0.0	0	t	t
5fe0df19-ef12-4324-984b-3f462da99128	Prozess löschen	DeleteProcessDef	Definitions_2	<?xml version="1.0" encoding="UTF-8"?>\n<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" id="Definitions_2" targetNamespace="http://bpmn.io/schema/bpmn" exporter="Camunda Modeler" exporterVersion="1.11.2">\n  <bpmn:collaboration id="Collaboration_045wrtb">\n    <bpmn:participant id="Participant_0us50cv" name="Prozess löschen" processRef="DeleteProcessDef" />\n  </bpmn:collaboration>\n  <bpmn:process id="DeleteProcessDef" name="Prozess löschen" isExecutable="false" camunda:versionTag="1.0.0">\n    <bpmn:extensionElements>\n      <camunda:properties>\n        <camunda:property name="persist" value="false" />\n      </camunda:properties>\n    </bpmn:extensionElements>\n    <bpmn:laneSet>\n      <bpmn:lane id="Lane_1efnqeo" name="Agent">\n        <bpmn:flowNodeRef>StartEvent</bpmn:flowNodeRef>\n        <bpmn:flowNodeRef>ExclusiveGateway_0e9znwu</bpmn:flowNodeRef>\n        <bpmn:flowNodeRef>EndEvent_0q0x49e</bpmn:flowNodeRef>\n        <bpmn:flowNodeRef>Task_01b43wb</bpmn:flowNodeRef>\n        <bpmn:flowNodeRef>EndEvent_1mibekw</bpmn:flowNodeRef>\n        <bpmn:flowNodeRef>Task_1ck7in7</bpmn:flowNodeRef>\n      </bpmn:lane>\n    </bpmn:laneSet>\n    <bpmn:sequenceFlow id="SequenceFlow_0bcalzv" sourceRef="StartEvent" targetRef="Task_1ck7in7" />\n    <bpmn:sequenceFlow id="SequenceFlow_1ejjcqo" sourceRef="Task_1ck7in7" targetRef="ExclusiveGateway_0e9znwu" />\n    <bpmn:sequenceFlow id="SequenceFlow_0otvn59" name="nicht entfernen" sourceRef="ExclusiveGateway_0e9znwu" targetRef="EndEvent_0q0x49e">\n      <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression"><![CDATA[this.current.key !== 'confirm']]></bpmn:conditionExpression>\n    </bpmn:sequenceFlow>\n    <bpmn:sequenceFlow id="SequenceFlow_1ptibf2" name="entfernen&#10;" sourceRef="ExclusiveGateway_0e9znwu" targetRef="Task_01b43wb">\n      <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression"><![CDATA[this.current.key === 'confirm']]></bpmn:conditionExpression>\n    </bpmn:sequenceFlow>\n    <bpmn:startEvent id="StartEvent" name="Lösche Prozess">\n      <bpmn:outgoing>SequenceFlow_0bcalzv</bpmn:outgoing>\n    </bpmn:startEvent>\n    <bpmn:exclusiveGateway id="ExclusiveGateway_0e9znwu" name="Bestätigung prüfen">\n      <bpmn:incoming>SequenceFlow_1ejjcqo</bpmn:incoming>\n      <bpmn:outgoing>SequenceFlow_0otvn59</bpmn:outgoing>\n      <bpmn:outgoing>SequenceFlow_1ptibf2</bpmn:outgoing>\n    </bpmn:exclusiveGateway>\n    <bpmn:sequenceFlow id="SequenceFlow_1v963lh" sourceRef="Task_01b43wb" targetRef="EndEvent_1mibekw" />\n    <bpmn:endEvent id="EndEvent_0q0x49e">\n      <bpmn:incoming>SequenceFlow_0otvn59</bpmn:incoming>\n    </bpmn:endEvent>\n    <bpmn:serviceTask id="Task_01b43wb" name="Prozess löschen">\n      <bpmn:extensionElements>\n        <camunda:properties>\n          <camunda:property name="module" value="DatastoreService" />\n          <camunda:property name="method" value="removeEntity" />\n          <camunda:property name="params" value="[&#39;ProcessDef&#39;, token.history.StartEvent.id, context]" />\n        </camunda:properties>\n      </bpmn:extensionElements>\n      <bpmn:incoming>SequenceFlow_1ptibf2</bpmn:incoming>\n      <bpmn:outgoing>SequenceFlow_1v963lh</bpmn:outgoing>\n    </bpmn:serviceTask>\n    <bpmn:endEvent id="EndEvent_1mibekw">\n      <bpmn:incoming>SequenceFlow_1v963lh</bpmn:incoming>\n    </bpmn:endEvent>\n    <bpmn:userTask id="Task_1ck7in7" name="Löschen bestätigen">\n      <bpmn:extensionElements>\n        <camunda:properties>\n          <camunda:property name="uiName" value="Confirm" />\n          <camunda:property name="uiConfig" value="${ &#34;message&#34;: &#34;Soll der Prozess wirklich gelöscht werden?&#34;, &#34;layout&#34;: [ { &#34;key&#34;: &#34;cancel&#34;, &#34;label&#34;: &#34;Abbrechen&#34; }, { &#34;key&#34;: &#34;confirm&#34;, &#34;label&#34;: &#34;Löschen&#34; } ] };" />\n        </camunda:properties>\n      </bpmn:extensionElements>\n      <bpmn:incoming>SequenceFlow_0bcalzv</bpmn:incoming>\n      <bpmn:outgoing>SequenceFlow_1ejjcqo</bpmn:outgoing>\n    </bpmn:userTask>\n  </bpmn:process>\n  <bpmndi:BPMNDiagram id="BPMNDiagram_1">\n    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Collaboration_045wrtb">\n      <bpmndi:BPMNShape id="Participant_1i31rgo_di" bpmnElement="Participant_0us50cv">\n        <dc:Bounds x="139" y="57" width="675" height="328" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent">\n        <dc:Bounds x="236" y="133" width="36" height="36" />\n        <bpmndi:BPMNLabel>\n          <dc:Bounds x="215" y="169" width="79" height="13" />\n        </bpmndi:BPMNLabel>\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id="Lane_1efnqeo_di" bpmnElement="Lane_1efnqeo">\n        <dc:Bounds x="169" y="57" width="645" height="328" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id="UserTask_1kt1u8z_di" bpmnElement="Task_1ck7in7">\n        <dc:Bounds x="369" y="111" width="100" height="80" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNEdge id="SequenceFlow_0bcalzv_di" bpmnElement="SequenceFlow_0bcalzv">\n        <di:waypoint xsi:type="dc:Point" x="272" y="151" />\n        <di:waypoint xsi:type="dc:Point" x="369" y="151" />\n        <bpmndi:BPMNLabel>\n          <dc:Bounds x="275.5" y="129.5" width="90" height="13" />\n        </bpmndi:BPMNLabel>\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNShape id="ExclusiveGateway_0e9znwu_di" bpmnElement="ExclusiveGateway_0e9znwu" isMarkerVisible="true">\n        <dc:Bounds x="542" y="126" width="50" height="50" />\n        <bpmndi:BPMNLabel>\n          <dc:Bounds x="537" y="92" width="59" height="25" />\n        </bpmndi:BPMNLabel>\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNEdge id="SequenceFlow_1ejjcqo_di" bpmnElement="SequenceFlow_1ejjcqo">\n        <di:waypoint xsi:type="dc:Point" x="469" y="151" />\n        <di:waypoint xsi:type="dc:Point" x="542" y="151" />\n        <bpmndi:BPMNLabel>\n          <dc:Bounds x="460.5" y="129.5" width="90" height="13" />\n        </bpmndi:BPMNLabel>\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNShape id="EndEvent_0q0x49e_di" bpmnElement="EndEvent_0q0x49e">\n        <dc:Bounds x="719" y="133" width="36" height="36" />\n        <bpmndi:BPMNLabel>\n          <dc:Bounds x="692" y="172" width="90" height="13" />\n        </bpmndi:BPMNLabel>\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNEdge id="SequenceFlow_0otvn59_di" bpmnElement="SequenceFlow_0otvn59">\n        <di:waypoint xsi:type="dc:Point" x="592" y="151" />\n        <di:waypoint xsi:type="dc:Point" x="719" y="151" />\n        <bpmndi:BPMNLabel>\n          <dc:Bounds x="608.9496402877697" y="131" width="73" height="12" />\n        </bpmndi:BPMNLabel>\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id="SequenceFlow_1ptibf2_di" bpmnElement="SequenceFlow_1ptibf2">\n        <di:waypoint xsi:type="dc:Point" x="567" y="176" />\n        <di:waypoint xsi:type="dc:Point" x="567" y="260" />\n        <bpmndi:BPMNLabel>\n          <dc:Bounds x="572" y="192.6052631578947" width="47" height="25" />\n        </bpmndi:BPMNLabel>\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNShape id="EndEvent_1mibekw_di" bpmnElement="EndEvent_1mibekw">\n        <dc:Bounds x="719" y="282" width="36" height="36" />\n        <bpmndi:BPMNLabel>\n          <dc:Bounds x="692" y="321" width="90" height="13" />\n        </bpmndi:BPMNLabel>\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNEdge id="SequenceFlow_1v963lh_di" bpmnElement="SequenceFlow_1v963lh">\n        <di:waypoint xsi:type="dc:Point" x="617" y="300" />\n        <di:waypoint xsi:type="dc:Point" x="668" y="300" />\n        <di:waypoint xsi:type="dc:Point" x="668" y="300" />\n        <di:waypoint xsi:type="dc:Point" x="719" y="300" />\n        <bpmndi:BPMNLabel>\n          <dc:Bounds x="638" y="293.5" width="90" height="13" />\n        </bpmndi:BPMNLabel>\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNShape id="ServiceTask_0hxp4pz_di" bpmnElement="Task_01b43wb">\n        <dc:Bounds x="517" y="260" width="100" height="80" />\n      </bpmndi:BPMNShape>\n    </bpmndi:BPMNPlane>\n  </bpmndi:BPMNDiagram>\n</bpmn:definitions>\n	{"properties": [{"name": "persist", "$type": "camunda:property", "value": "false"}]}	deleteProcessDef.bpmn	/Users/heiko/Desktop/Projekte/BPMN/consumer_api_meta/node_modules/@process-engine/process_repository/bpmn/deleteProcessDef.bpmn	internal	process_engine	\N	1.0.0	0	t	t
61aae60a-ff74-460c-a7b3-10f705b463b8	consumer_api_lane_test	consumer_api_lane_test	Definition_1	<?xml version="1.0" encoding="UTF-8"?>\n<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" id="Definition_1" targetNamespace="http://bpmn.io/schema/bpmn" exporter="Camunda Modeler" exporterVersion="1.8.0"><bpmn:collaboration id="Collaboration_1cidyxu"><bpmn:participant id="Participant_0px403d" name="consumer_api_lane_test" processRef="consumer_api_lane_test" /></bpmn:collaboration><bpmn:process id="consumer_api_lane_test" name="consumer_api_lane_test" isExecutable="false"><bpmn:laneSet><bpmn:lane id="Lane_1xzf0d3" name="Lane A"><bpmn:extensionElements><camunda:executionListener class="" event="" /><camunda:properties><camunda:property name="role" value="123" /></camunda:properties></bpmn:extensionElements><bpmn:flowNodeRef>StartEvent_0yfvdj3</bpmn:flowNodeRef><bpmn:flowNodeRef>Task_0l3cpkx</bpmn:flowNodeRef><bpmn:flowNodeRef>Task_11ng559</bpmn:flowNodeRef><bpmn:flowNodeRef>EndEvent_1val5zu</bpmn:flowNodeRef><bpmn:flowNodeRef>ExclusiveGateway_0m2ork1</bpmn:flowNodeRef><bpmn:flowNodeRef>EndEvent_16w6fr2</bpmn:flowNodeRef><bpmn:flowNodeRef>StartEvent_1</bpmn:flowNodeRef><bpmn:flowNodeRef>Task_10gpc45</bpmn:flowNodeRef><bpmn:flowNodeRef>EndEvent_0gtl02k</bpmn:flowNodeRef><bpmn:childLaneSet><bpmn:lane id="Lane_00inacb" name="Lane B"><bpmn:flowNodeRef>StartEvent_0yfvdj3</bpmn:flowNodeRef><bpmn:flowNodeRef>Task_0l3cpkx</bpmn:flowNodeRef><bpmn:flowNodeRef>EndEvent_1val5zu</bpmn:flowNodeRef><bpmn:flowNodeRef>ExclusiveGateway_0m2ork1</bpmn:flowNodeRef></bpmn:lane><bpmn:lane id="Lane_01y5f52" name="Lane C"><bpmn:flowNodeRef>Task_11ng559</bpmn:flowNodeRef><bpmn:flowNodeRef>EndEvent_16w6fr2</bpmn:flowNodeRef><bpmn:flowNodeRef>StartEvent_1</bpmn:flowNodeRef><bpmn:flowNodeRef>Task_10gpc45</bpmn:flowNodeRef><bpmn:flowNodeRef>EndEvent_0gtl02k</bpmn:flowNodeRef><bpmn:childLaneSet><bpmn:lane id="Lane_0z69yj5" name="Lane E"><bpmn:flowNodeRef>Task_10gpc45</bpmn:flowNodeRef><bpmn:flowNodeRef>EndEvent_0gtl02k</bpmn:flowNodeRef></bpmn:lane><bpmn:lane id="Lane_0fovtz3" name="Lane D"><bpmn:flowNodeRef>Task_11ng559</bpmn:flowNodeRef><bpmn:flowNodeRef>EndEvent_16w6fr2</bpmn:flowNodeRef><bpmn:flowNodeRef>StartEvent_1</bpmn:flowNodeRef></bpmn:lane></bpmn:childLaneSet></bpmn:lane></bpmn:childLaneSet></bpmn:lane></bpmn:laneSet><bpmn:sequenceFlow id="SequenceFlow_0njyz0c" sourceRef="StartEvent_1" targetRef="Task_11ng559" /><bpmn:sequenceFlow id="SequenceFlow_08ky93g" sourceRef="Task_11ng559" targetRef="EndEvent_16w6fr2" /><bpmn:sequenceFlow id="SequenceFlow_13pkx0l" sourceRef="StartEvent_0yfvdj3" targetRef="ExclusiveGateway_0m2ork1" /><bpmn:sequenceFlow id="SequenceFlow_0gq1iy1" sourceRef="Task_0l3cpkx" targetRef="EndEvent_1val5zu" /><bpmn:startEvent id="StartEvent_0yfvdj3" name=""><bpmn:outgoing>SequenceFlow_13pkx0l</bpmn:outgoing></bpmn:startEvent><bpmn:endEvent id="EndEvent_1val5zu" name=""><bpmn:incoming>SequenceFlow_0gq1iy1</bpmn:incoming></bpmn:endEvent><bpmn:userTask id="Task_0l3cpkx" name="UT1" camunda:formKey="Form Key"><bpmn:extensionElements><camunda:formData><camunda:formField id="Form_TlgO8xvn" label="" type="enum" defaultValue="" /></camunda:formData></bpmn:extensionElements><bpmn:incoming>SequenceFlow_17p3vrj</bpmn:incoming><bpmn:outgoing>SequenceFlow_0gq1iy1</bpmn:outgoing></bpmn:userTask><bpmn:exclusiveGateway id="ExclusiveGateway_0m2ork1"><bpmn:incoming>SequenceFlow_13pkx0l</bpmn:incoming><bpmn:outgoing>SequenceFlow_17p3vrj</bpmn:outgoing><bpmn:outgoing>SequenceFlow_0c4x2ue</bpmn:outgoing></bpmn:exclusiveGateway><bpmn:sequenceFlow id="SequenceFlow_17p3vrj" sourceRef="ExclusiveGateway_0m2ork1" targetRef="Task_0l3cpkx" /><bpmn:userTask id="Task_11ng559" name="UT2" camunda:formKey="Form Key"><bpmn:extensionElements><camunda:formData><camunda:formField id="Form_dz2ZcHjt" label="asd" type="string" defaultValue="asdasd" /></camunda:formData><camunda:properties><camunda:property name="uiName" value="Form" /></camunda:properties></bpmn:extensionElements><bpmn:incoming>SequenceFlow_0njyz0c</bpmn:incoming><bpmn:outgoing>SequenceFlow_08ky93g</bpmn:outgoing></bpmn:userTask><bpmn:endEvent id="EndEvent_16w6fr2" name=""><bpmn:incoming>SequenceFlow_08ky93g</bpmn:incoming></bpmn:endEvent><bpmn:startEvent id="StartEvent_1" name="consumer_api_lane_test"><bpmn:outgoing>SequenceFlow_0njyz0c</bpmn:outgoing></bpmn:startEvent><bpmn:callActivity id="Task_10gpc45" name="" calledElement="consumer_api_usertask_test"><bpmn:incoming>SequenceFlow_0c4x2ue</bpmn:incoming><bpmn:outgoing>SequenceFlow_0l0ozof</bpmn:outgoing></bpmn:callActivity><bpmn:sequenceFlow id="SequenceFlow_0c4x2ue" sourceRef="ExclusiveGateway_0m2ork1" targetRef="Task_10gpc45" /><bpmn:endEvent id="EndEvent_0gtl02k"><bpmn:incoming>SequenceFlow_0l0ozof</bpmn:incoming></bpmn:endEvent><bpmn:sequenceFlow id="SequenceFlow_0l0ozof" sourceRef="Task_10gpc45" targetRef="EndEvent_0gtl02k" /></bpmn:process><bpmndi:BPMNDiagram id="BPMNDiagram_1"><bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Collaboration_1cidyxu"><bpmndi:BPMNShape id="Participant_0px403d_di" bpmnElement="Participant_0px403d"><dc:Bounds x="5" y="-11" width="533" height="322" /></bpmndi:BPMNShape><bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1"><dc:Bounds x="149" y="224" width="36" height="36" /><bpmndi:BPMNLabel><dc:Bounds x="126" y="260" width="84" height="24" /></bpmndi:BPMNLabel></bpmndi:BPMNShape><bpmndi:BPMNShape id="Lane_1xzf0d3_di" bpmnElement="Lane_1xzf0d3"><dc:Bounds x="35" y="-11" width="503" height="322" /></bpmndi:BPMNShape><bpmndi:BPMNEdge id="SequenceFlow_0njyz0c_di" bpmnElement="SequenceFlow_0njyz0c"><di:waypoint x="185" y="242" /><di:waypoint x="224" y="242" /><di:waypoint x="224" y="242" /><di:waypoint x="259" y="242" /><bpmndi:BPMNLabel><dc:Bounds x="194" y="236" width="90" height="12" /></bpmndi:BPMNLabel></bpmndi:BPMNEdge><bpmndi:BPMNShape id="UserTask_0jyomg5_di" bpmnElement="Task_11ng559"><dc:Bounds x="259" y="202" width="100" height="80" /></bpmndi:BPMNShape><bpmndi:BPMNShape id="EndEvent_16w6fr2_di" bpmnElement="EndEvent_16w6fr2"><dc:Bounds x="444" y="224" width="36" height="36" /><bpmndi:BPMNLabel><dc:Bounds x="417" y="264" width="90" height="12" /></bpmndi:BPMNLabel></bpmndi:BPMNShape><bpmndi:BPMNEdge id="SequenceFlow_08ky93g_di" bpmnElement="SequenceFlow_08ky93g"><di:waypoint x="359" y="242" /><di:waypoint x="402" y="242" /><di:waypoint x="402" y="242" /><di:waypoint x="444" y="242" /><bpmndi:BPMNLabel><dc:Bounds x="372" y="236" width="90" height="12" /></bpmndi:BPMNLabel></bpmndi:BPMNEdge><bpmndi:BPMNShape id="Lane_00inacb_di" bpmnElement="Lane_00inacb"><dc:Bounds x="65" y="-11" width="473" height="100" /></bpmndi:BPMNShape><bpmndi:BPMNShape id="Lane_01y5f52_di" bpmnElement="Lane_01y5f52"><dc:Bounds x="65" y="89" width="473" height="222" /></bpmndi:BPMNShape><bpmndi:BPMNShape id="Lane_0z69yj5_di" bpmnElement="Lane_0z69yj5"><dc:Bounds x="95" y="89" width="443" height="99" /></bpmndi:BPMNShape><bpmndi:BPMNShape id="Lane_0fovtz3_di" bpmnElement="Lane_0fovtz3"><dc:Bounds x="95" y="188" width="443" height="123" /></bpmndi:BPMNShape><bpmndi:BPMNShape id="StartEvent_0yfvdj3_di" bpmnElement="StartEvent_0yfvdj3"><dc:Bounds x="131" y="22" width="36" height="36" /><bpmndi:BPMNLabel><dc:Bounds x="149" y="61" width="0" height="13" /></bpmndi:BPMNLabel></bpmndi:BPMNShape><bpmndi:BPMNEdge id="SequenceFlow_13pkx0l_di" bpmnElement="SequenceFlow_13pkx0l"><di:waypoint x="167" y="40" /><di:waypoint x="207" y="40" /><bpmndi:BPMNLabel><dc:Bounds x="142" y="18.5" width="90" height="13" /></bpmndi:BPMNLabel></bpmndi:BPMNEdge><bpmndi:BPMNShape id="EndEvent_1val5zu_di" bpmnElement="EndEvent_1val5zu"><dc:Bounds x="444" y="22" width="36" height="36" /><bpmndi:BPMNLabel><dc:Bounds x="417" y="61" width="90" height="13" /></bpmndi:BPMNLabel></bpmndi:BPMNShape><bpmndi:BPMNEdge id="SequenceFlow_0gq1iy1_di" bpmnElement="SequenceFlow_0gq1iy1"><di:waypoint x="405" y="40" /><di:waypoint x="444" y="40" /><bpmndi:BPMNLabel><dc:Bounds x="379.5" y="18.5" width="90" height="13" /></bpmndi:BPMNLabel></bpmndi:BPMNEdge><bpmndi:BPMNShape id="UserTask_0550688_di" bpmnElement="Task_0l3cpkx"><dc:Bounds x="305" y="0" width="100" height="80" /></bpmndi:BPMNShape><bpmndi:BPMNShape id="CallActivity_1f035wj_di" bpmnElement="Task_10gpc45"><dc:Bounds x="305" y="100" width="100" height="80" /></bpmndi:BPMNShape><bpmndi:BPMNShape id="ExclusiveGateway_0m2ork1_di" bpmnElement="ExclusiveGateway_0m2ork1" isMarkerVisible="true"><dc:Bounds x="207" y="15" width="50" height="50" /><bpmndi:BPMNLabel><dc:Bounds x="232" y="69" width="0" height="12" /></bpmndi:BPMNLabel></bpmndi:BPMNShape><bpmndi:BPMNEdge id="SequenceFlow_17p3vrj_di" bpmnElement="SequenceFlow_17p3vrj"><di:waypoint x="257" y="40" /><di:waypoint x="305" y="40" /><bpmndi:BPMNLabel><dc:Bounds x="281" y="19" width="0" height="12" /></bpmndi:BPMNLabel></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="SequenceFlow_0c4x2ue_di" bpmnElement="SequenceFlow_0c4x2ue"><di:waypoint x="232" y="65" /><di:waypoint x="232" y="140" /><di:waypoint x="305" y="140" /><bpmndi:BPMNLabel><dc:Bounds x="247" y="96.5" width="0" height="12" /></bpmndi:BPMNLabel></bpmndi:BPMNEdge><bpmndi:BPMNShape id="EndEvent_0gtl02k_di" bpmnElement="EndEvent_0gtl02k"><dc:Bounds x="444" y="122" width="36" height="36" /><bpmndi:BPMNLabel><dc:Bounds x="462" y="162" width="0" height="12" /></bpmndi:BPMNLabel></bpmndi:BPMNShape><bpmndi:BPMNEdge id="SequenceFlow_0l0ozof_di" bpmnElement="SequenceFlow_0l0ozof"><di:waypoint x="405" y="140" /><di:waypoint x="444" y="140" /><bpmndi:BPMNLabel><dc:Bounds x="424.5" y="119" width="0" height="12" /></bpmndi:BPMNLabel></bpmndi:BPMNEdge></bpmndi:BPMNPlane></bpmndi:BPMNDiagram></bpmn:definitions>	\N	test_consumer_api_lanes	/Users/heiko/Desktop/Projekte/BPMN/consumer_api_meta/_integration_tests/application/bpmn/test_consumer_api_lanes.bpmn	internal	process_engine_meta	\N	\N	0	t	t
cd759de6-9b6c-435a-b6ab-f637780238e0	test_consumer_api_process_start	test_consumer_api_process_start	Definition_1	<?xml version="1.0" encoding="UTF-8"?>\n<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" id="Definition_1" targetNamespace="http://bpmn.io/schema/bpmn" exporter="Camunda Modeler" exporterVersion="1.10.0">\n  <bpmn:collaboration id="Collaboration_1cidyxu">\n    <bpmn:participant id="Participant_0px403d" name="test_consumer_api_process_start" processRef="test_consumer_api_process_start" />\n  </bpmn:collaboration>\n  <bpmn:process id="test_consumer_api_process_start" name="test_consumer_api_process_start" isExecutable="false">\n    <bpmn:laneSet>\n      <bpmn:lane id="Lane_1xzf0d3" name="can_start_process">\n        <bpmn:extensionElements>\n          <camunda:properties>\n            <camunda:property name="role" value="user" />\n          </camunda:properties>\n        </bpmn:extensionElements>\n        <bpmn:flowNodeRef>scriptTask_SimulateProcessError</bpmn:flowNodeRef>\n        <bpmn:flowNodeRef>scriptTask_WriteConsoleLog</bpmn:flowNodeRef>\n        <bpmn:flowNodeRef>EndEvent_Success</bpmn:flowNodeRef>\n        <bpmn:flowNodeRef>EndEvent_Error</bpmn:flowNodeRef>\n        <bpmn:flowNodeRef>ExclusiveGateway_0bnj53e</bpmn:flowNodeRef>\n        <bpmn:flowNodeRef>StartEvent_1</bpmn:flowNodeRef>\n      </bpmn:lane>\n    </bpmn:laneSet>\n    <bpmn:sequenceFlow id="SequenceFlow_0vspoh6" sourceRef="StartEvent_1" targetRef="ExclusiveGateway_0bnj53e" />\n    <bpmn:sequenceFlow id="SequenceFlow_0s3n7ck" name="" sourceRef="ExclusiveGateway_0bnj53e" targetRef="scriptTask_SimulateProcessError">\n      <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression">token.history.StartEvent_1.causeError === true</bpmn:conditionExpression>\n    </bpmn:sequenceFlow>\n    <bpmn:scriptTask id="scriptTask_SimulateProcessError" name="Simulate Process Error">\n      <bpmn:extensionElements>\n        <camunda:executionListener class="" event="" />\n        <camunda:properties />\n      </bpmn:extensionElements>\n      <bpmn:incoming>SequenceFlow_0s3n7ck</bpmn:incoming>\n      <bpmn:outgoing>SequenceFlow_0aopc8s</bpmn:outgoing>\n      <bpmn:script><![CDATA[throw new Error('Critical error during task!');]]></bpmn:script>\n    </bpmn:scriptTask>\n    <bpmn:sequenceFlow id="SequenceFlow_0dbx7lk" name="" sourceRef="ExclusiveGateway_0bnj53e" targetRef="scriptTask_WriteConsoleLog">\n      <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression">token.history.StartEvent_1.causeError !== true</bpmn:conditionExpression>\n    </bpmn:sequenceFlow>\n    <bpmn:scriptTask id="scriptTask_WriteConsoleLog" name="Write Log">\n      <bpmn:incoming>SequenceFlow_0dbx7lk</bpmn:incoming>\n      <bpmn:outgoing>SequenceFlow_0dqpbny</bpmn:outgoing>\n      <bpmn:script><![CDATA[console.log('Successfully started the process!');]]></bpmn:script>\n    </bpmn:scriptTask>\n    <bpmn:endEvent id="EndEvent_Success" name="">\n      <bpmn:incoming>SequenceFlow_0dqpbny</bpmn:incoming>\n    </bpmn:endEvent>\n    <bpmn:sequenceFlow id="SequenceFlow_0dqpbny" sourceRef="scriptTask_WriteConsoleLog" targetRef="EndEvent_Success">\n      <bpmn:extensionElements>\n        <camunda:properties>\n          <camunda:property name="mapper" value="&#34;EndEvent_Success&#34;" />\n        </camunda:properties>\n      </bpmn:extensionElements>\n    </bpmn:sequenceFlow>\n    <bpmn:sequenceFlow id="SequenceFlow_0aopc8s" sourceRef="scriptTask_SimulateProcessError" targetRef="EndEvent_Error" />\n    <bpmn:endEvent id="EndEvent_Error" name="">\n      <bpmn:incoming>SequenceFlow_0aopc8s</bpmn:incoming>\n      <bpmn:errorEventDefinition />\n    </bpmn:endEvent>\n    <bpmn:exclusiveGateway id="ExclusiveGateway_0bnj53e" name="">\n      <bpmn:incoming>SequenceFlow_0vspoh6</bpmn:incoming>\n      <bpmn:outgoing>SequenceFlow_0s3n7ck</bpmn:outgoing>\n      <bpmn:outgoing>SequenceFlow_0dbx7lk</bpmn:outgoing>\n    </bpmn:exclusiveGateway>\n    <bpmn:startEvent id="StartEvent_1" name="test_consumer_api_process_start">\n      <bpmn:outgoing>SequenceFlow_0vspoh6</bpmn:outgoing>\n    </bpmn:startEvent>\n  </bpmn:process>\n  <bpmndi:BPMNDiagram id="BPMNDiagram_1">\n    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Collaboration_1cidyxu">\n      <bpmndi:BPMNShape id="Participant_0px403d_di" bpmnElement="Participant_0px403d">\n        <dc:Bounds x="5" y="4" width="708" height="333" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">\n        <dc:Bounds x="99" y="147" width="36" height="36" />\n        <bpmndi:BPMNLabel>\n          <dc:Bounds x="76" y="183" width="85" height="25" />\n        </bpmndi:BPMNLabel>\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id="Lane_1xzf0d3_di" bpmnElement="Lane_1xzf0d3">\n        <dc:Bounds x="35" y="4" width="678" height="333" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id="ExclusiveGateway_0bnj53e_di" bpmnElement="ExclusiveGateway_0bnj53e" isMarkerVisible="true">\n        <dc:Bounds x="217" y="140" width="50" height="50" />\n        <bpmndi:BPMNLabel>\n          <dc:Bounds x="197" y="193" width="90" height="13" />\n        </bpmndi:BPMNLabel>\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNEdge id="SequenceFlow_0vspoh6_di" bpmnElement="SequenceFlow_0vspoh6">\n        <di:waypoint xsi:type="dc:Point" x="135" y="165" />\n        <di:waypoint xsi:type="dc:Point" x="176" y="165" />\n        <di:waypoint xsi:type="dc:Point" x="176" y="165" />\n        <di:waypoint xsi:type="dc:Point" x="217" y="165" />\n        <bpmndi:BPMNLabel>\n          <dc:Bounds x="146" y="158.5" width="90" height="13" />\n        </bpmndi:BPMNLabel>\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id="SequenceFlow_0s3n7ck_di" bpmnElement="SequenceFlow_0s3n7ck">\n        <di:waypoint xsi:type="dc:Point" x="242" y="140" />\n        <di:waypoint xsi:type="dc:Point" x="242" y="73" />\n        <di:waypoint xsi:type="dc:Point" x="351" y="73" />\n        <bpmndi:BPMNLabel>\n          <dc:Bounds x="212" y="100" width="90" height="13" />\n        </bpmndi:BPMNLabel>\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNShape id="ScriptTask_1sg2kce_di" bpmnElement="scriptTask_SimulateProcessError">\n        <dc:Bounds x="351" y="33" width="100" height="80" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNEdge id="SequenceFlow_0dbx7lk_di" bpmnElement="SequenceFlow_0dbx7lk">\n        <di:waypoint xsi:type="dc:Point" x="242" y="190" />\n        <di:waypoint xsi:type="dc:Point" x="242" y="257" />\n        <di:waypoint xsi:type="dc:Point" x="351" y="257" />\n        <bpmndi:BPMNLabel>\n          <dc:Bounds x="212" y="217" width="90" height="13" />\n        </bpmndi:BPMNLabel>\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNShape id="ScriptTask_183p48e_di" bpmnElement="scriptTask_WriteConsoleLog">\n        <dc:Bounds x="351" y="217" width="100" height="80" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id="EndEvent_0by117k_di" bpmnElement="EndEvent_Success">\n        <dc:Bounds x="608" y="239" width="36" height="36" />\n        <bpmndi:BPMNLabel>\n          <dc:Bounds x="626" y="278" width="0" height="13" />\n        </bpmndi:BPMNLabel>\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNEdge id="SequenceFlow_0dqpbny_di" bpmnElement="SequenceFlow_0dqpbny">\n        <di:waypoint xsi:type="dc:Point" x="451" y="257" />\n        <di:waypoint xsi:type="dc:Point" x="608" y="257" />\n        <bpmndi:BPMNLabel>\n          <dc:Bounds x="529.5" y="235" width="0" height="13" />\n        </bpmndi:BPMNLabel>\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id="SequenceFlow_0aopc8s_di" bpmnElement="SequenceFlow_0aopc8s">\n        <di:waypoint xsi:type="dc:Point" x="451" y="73" />\n        <di:waypoint xsi:type="dc:Point" x="608" y="73" />\n        <bpmndi:BPMNLabel>\n          <dc:Bounds x="529.5" y="51.5" width="0" height="13" />\n        </bpmndi:BPMNLabel>\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNShape id="EndEvent_12yyq3h_di" bpmnElement="EndEvent_Error">\n        <dc:Bounds x="608" y="55" width="36" height="36" />\n        <bpmndi:BPMNLabel>\n          <dc:Bounds x="626" y="94" width="0" height="13" />\n        </bpmndi:BPMNLabel>\n      </bpmndi:BPMNShape>\n    </bpmndi:BPMNPlane>\n  </bpmndi:BPMNDiagram>\n</bpmn:definitions>\n	\N	test_consumer_api_process_start	/Users/heiko/Desktop/Projekte/BPMN/consumer_api_meta/_integration_tests/application/bpmn/test_consumer_api_process_start.bpmn	internal	process_engine_meta	\N	\N	0	t	t
6b12396f-46bd-4ad5-b616-0fb11138b24a	consumer_api_usertask_test	consumer_api_usertask_test	Definition_1	<?xml version="1.0" encoding="UTF-8"?>\n<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" id="Definition_1" targetNamespace="http://bpmn.io/schema/bpmn" exporter="Camunda Modeler" exporterVersion="1.8.0"><bpmn:collaboration id="Collaboration_1cidyxu"><bpmn:participant id="Participant_0px403d" name="consumer_api_usertask_test" processRef="consumer_api_usertask_test" /></bpmn:collaboration><bpmn:process id="consumer_api_usertask_test" name="consumer_api_usertask_test" isExecutable="false"><bpmn:laneSet><bpmn:lane id="Lane_1xzf0d3" name="can_view_usertask"><bpmn:flowNodeRef>StartEvent_1</bpmn:flowNodeRef><bpmn:flowNodeRef>Task_1vdwmn1</bpmn:flowNodeRef><bpmn:flowNodeRef>EndEvent_1j67qnl</bpmn:flowNodeRef></bpmn:lane></bpmn:laneSet><bpmn:startEvent id="StartEvent_1" name="consumer_api_usertask_test"><bpmn:outgoing>SequenceFlow_0fkan76</bpmn:outgoing></bpmn:startEvent><bpmn:sequenceFlow id="SequenceFlow_0fkan76" sourceRef="StartEvent_1" targetRef="Task_1vdwmn1" /><bpmn:userTask id="Task_1vdwmn1" name="" camunda:formKey="Form Key"><bpmn:extensionElements><camunda:formData><camunda:formField id="Form_XGSVBgio" label="" type="boolean" defaultValue="" /></camunda:formData></bpmn:extensionElements><bpmn:incoming>SequenceFlow_0fkan76</bpmn:incoming><bpmn:outgoing>SequenceFlow_00nxkwz</bpmn:outgoing></bpmn:userTask><bpmn:endEvent id="EndEvent_1j67qnl"><bpmn:incoming>SequenceFlow_00nxkwz</bpmn:incoming></bpmn:endEvent><bpmn:sequenceFlow id="SequenceFlow_00nxkwz" sourceRef="Task_1vdwmn1" targetRef="EndEvent_1j67qnl" /></bpmn:process><bpmndi:BPMNDiagram id="BPMNDiagram_1"><bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Collaboration_1cidyxu"><bpmndi:BPMNShape id="Participant_0px403d_di" bpmnElement="Participant_0px403d"><dc:Bounds x="5" y="4" width="517" height="166" /></bpmndi:BPMNShape><bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1"><dc:Bounds x="101" y="65" width="36" height="36" /><bpmndi:BPMNLabel><dc:Bounds x="109" y="101" width="21" height="13" /></bpmndi:BPMNLabel></bpmndi:BPMNShape><bpmndi:BPMNShape id="Lane_1xzf0d3_di" bpmnElement="Lane_1xzf0d3"><dc:Bounds x="35" y="4" width="487" height="166" /></bpmndi:BPMNShape><bpmndi:BPMNEdge id="SequenceFlow_0fkan76_di" bpmnElement="SequenceFlow_0fkan76"><di:waypoint x="137" y="83" /><di:waypoint x="220" y="83" /><bpmndi:BPMNLabel><dc:Bounds x="178.5" y="62" width="0" height="12" /></bpmndi:BPMNLabel></bpmndi:BPMNEdge><bpmndi:BPMNShape id="UserTask_1q3b60b_di" bpmnElement="Task_1vdwmn1"><dc:Bounds x="220" y="43" width="100" height="80" /></bpmndi:BPMNShape><bpmndi:BPMNShape id="EndEvent_1j67qnl_di" bpmnElement="EndEvent_1j67qnl"><dc:Bounds x="400" y="65" width="36" height="36" /><bpmndi:BPMNLabel><dc:Bounds x="418" y="105" width="0" height="12" /></bpmndi:BPMNLabel></bpmndi:BPMNShape><bpmndi:BPMNEdge id="SequenceFlow_00nxkwz_di" bpmnElement="SequenceFlow_00nxkwz"><di:waypoint x="320" y="83" /><di:waypoint x="400" y="83" /><bpmndi:BPMNLabel><dc:Bounds x="360" y="62" width="0" height="12" /></bpmndi:BPMNLabel></bpmndi:BPMNEdge></bpmndi:BPMNPlane></bpmndi:BPMNDiagram></bpmn:definitions>	\N	test_consumer_api_usertask	/Users/heiko/Desktop/Projekte/BPMN/consumer_api_meta/_integration_tests/application/bpmn/test_consumer_api_usertask.bpmn	internal	process_engine_meta	\N	\N	0	t	t
\.


--
-- TOC entry 3027 (class 0 OID 16490)
-- Dependencies: 209
-- Data for Name: ProcessToken; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."ProcessToken" (id, data, process) FROM stdin;
\.


--
-- TOC entry 3028 (class 0 OID 16498)
-- Dependencies: 210
-- Data for Name: ScriptTask; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."ScriptTask" (id, name, key, process, "nodeDef", type, state, participant, application, "processToken", "instanceCounter", script) FROM stdin;
\.


--
-- TOC entry 3029 (class 0 OID 16506)
-- Dependencies: 211
-- Data for Name: ServiceTask; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."ServiceTask" (id, name, key, process, "nodeDef", type, state, participant, application, "processToken", "instanceCounter") FROM stdin;
\.


--
-- TOC entry 3030 (class 0 OID 16514)
-- Dependencies: 212
-- Data for Name: SessionStore; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."SessionStore" (id, "identityId", "systemUserId", data, roles) FROM stdin;
\.


--
-- TOC entry 3031 (class 0 OID 16522)
-- Dependencies: 213
-- Data for Name: StartEvent; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."StartEvent" (id, name, key, process, "nodeDef", type, state, participant, application, "processToken", "instanceCounter") FROM stdin;
\.


--
-- TOC entry 3032 (class 0 OID 16530)
-- Dependencies: 214
-- Data for Name: SubprocessExternal; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."SubprocessExternal" (id, name, key, process, "nodeDef", type, state, participant, application, "processToken", "instanceCounter") FROM stdin;
\.


--
-- TOC entry 3033 (class 0 OID 16538)
-- Dependencies: 215
-- Data for Name: SubprocessInternal; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."SubprocessInternal" (id, name, key, process, "nodeDef", type, state, participant, application, "processToken", "instanceCounter") FROM stdin;
\.


--
-- TOC entry 3034 (class 0 OID 16546)
-- Dependencies: 216
-- Data for Name: ThrowEvent; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."ThrowEvent" (id, name, key, process, "nodeDef", type, state, participant, application, "processToken", "instanceCounter") FROM stdin;
\.


--
-- TOC entry 3035 (class 0 OID 16554)
-- Dependencies: 217
-- Data for Name: Timer; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."Timer" (id, "timerType", "timerIsoString", "timerRule", "eventName", "lastElapsed") FROM stdin;
\.


--
-- TOC entry 3014 (class 0 OID 16386)
-- Dependencies: 196
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."User" (id, name, password, roles) FROM stdin;
61d7f2e3-3387-4115-895e-b04a49967b27	admin	0f3477f71c65c7ac;7e21f7fe996f797973df579c9b2116b9de5cb7756cbbee30fca8a9a927d78854	["administrator"]
75cb3dae-2a18-4112-8042-cf69198d1639	exampleuser	e297c78cdfd696a8;0d047fbfb5d090b37f1ba35faff745440df0ea6777d96a6733e4e420b910a66e	["user"]
\.


--
-- TOC entry 3036 (class 0 OID 16562)
-- Dependencies: 218
-- Data for Name: UserTask; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."UserTask" (id, name, key, process, "nodeDef", type, state, participant, application, "processToken", "instanceCounter") FROM stdin;
\.


--
-- TOC entry 2841 (class 2606 OID 16417)
-- Name: BoundaryEvent BoundaryEvent_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."BoundaryEvent"
    ADD CONSTRAINT "BoundaryEvent_pkey" PRIMARY KEY (id);


--
-- TOC entry 2843 (class 2606 OID 16425)
-- Name: CatchEvent CatchEvent_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."CatchEvent"
    ADD CONSTRAINT "CatchEvent_pkey" PRIMARY KEY (id);


--
-- TOC entry 2845 (class 2606 OID 16433)
-- Name: EndEvent EndEvent_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."EndEvent"
    ADD CONSTRAINT "EndEvent_pkey" PRIMARY KEY (id);


--
-- TOC entry 2839 (class 2606 OID 16409)
-- Name: Event Event_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Event"
    ADD CONSTRAINT "Event_pkey" PRIMARY KEY (id);


--
-- TOC entry 2847 (class 2606 OID 16441)
-- Name: ExclusiveGateway ExclusiveGateway_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."ExclusiveGateway"
    ADD CONSTRAINT "ExclusiveGateway_pkey" PRIMARY KEY (id);


--
-- TOC entry 2849 (class 2606 OID 16449)
-- Name: FlowDef FlowDef_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."FlowDef"
    ADD CONSTRAINT "FlowDef_pkey" PRIMARY KEY (id);


--
-- TOC entry 2851 (class 2606 OID 16457)
-- Name: Lane Lane_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Lane"
    ADD CONSTRAINT "Lane_pkey" PRIMARY KEY (id);


--
-- TOC entry 2853 (class 2606 OID 16465)
-- Name: NodeDef NodeDef_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."NodeDef"
    ADD CONSTRAINT "NodeDef_pkey" PRIMARY KEY (id);


--
-- TOC entry 2837 (class 2606 OID 16401)
-- Name: NodeInstance NodeInstance_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."NodeInstance"
    ADD CONSTRAINT "NodeInstance_pkey" PRIMARY KEY (id);


--
-- TOC entry 2855 (class 2606 OID 16473)
-- Name: ParallelGateway ParallelGateway_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."ParallelGateway"
    ADD CONSTRAINT "ParallelGateway_pkey" PRIMARY KEY (id);


--
-- TOC entry 2857 (class 2606 OID 16481)
-- Name: ProcessDef ProcessDef_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."ProcessDef"
    ADD CONSTRAINT "ProcessDef_pkey" PRIMARY KEY (id);


--
-- TOC entry 2861 (class 2606 OID 16497)
-- Name: ProcessToken ProcessToken_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."ProcessToken"
    ADD CONSTRAINT "ProcessToken_pkey" PRIMARY KEY (id);


--
-- TOC entry 2859 (class 2606 OID 16489)
-- Name: Process Process_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Process"
    ADD CONSTRAINT "Process_pkey" PRIMARY KEY (id);


--
-- TOC entry 2863 (class 2606 OID 16505)
-- Name: ScriptTask ScriptTask_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."ScriptTask"
    ADD CONSTRAINT "ScriptTask_pkey" PRIMARY KEY (id);


--
-- TOC entry 2865 (class 2606 OID 16513)
-- Name: ServiceTask ServiceTask_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."ServiceTask"
    ADD CONSTRAINT "ServiceTask_pkey" PRIMARY KEY (id);


--
-- TOC entry 2867 (class 2606 OID 16521)
-- Name: SessionStore SessionStore_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."SessionStore"
    ADD CONSTRAINT "SessionStore_pkey" PRIMARY KEY (id);


--
-- TOC entry 2869 (class 2606 OID 16529)
-- Name: StartEvent StartEvent_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."StartEvent"
    ADD CONSTRAINT "StartEvent_pkey" PRIMARY KEY (id);


--
-- TOC entry 2871 (class 2606 OID 16537)
-- Name: SubprocessExternal SubprocessExternal_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."SubprocessExternal"
    ADD CONSTRAINT "SubprocessExternal_pkey" PRIMARY KEY (id);


--
-- TOC entry 2873 (class 2606 OID 16545)
-- Name: SubprocessInternal SubprocessInternal_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."SubprocessInternal"
    ADD CONSTRAINT "SubprocessInternal_pkey" PRIMARY KEY (id);


--
-- TOC entry 2875 (class 2606 OID 16553)
-- Name: ThrowEvent ThrowEvent_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."ThrowEvent"
    ADD CONSTRAINT "ThrowEvent_pkey" PRIMARY KEY (id);


--
-- TOC entry 2877 (class 2606 OID 16561)
-- Name: Timer Timer_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Timer"
    ADD CONSTRAINT "Timer_pkey" PRIMARY KEY (id);


--
-- TOC entry 2879 (class 2606 OID 16569)
-- Name: UserTask UserTask_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."UserTask"
    ADD CONSTRAINT "UserTask_pkey" PRIMARY KEY (id);


--
-- TOC entry 2835 (class 2606 OID 16393)
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- TOC entry 2883 (class 2606 OID 16585)
-- Name: FlowDef FlowDef_processDef_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."FlowDef"
    ADD CONSTRAINT "FlowDef_processDef_fkey" FOREIGN KEY ("processDef") REFERENCES public."ProcessDef"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2884 (class 2606 OID 16590)
-- Name: FlowDef FlowDef_source_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."FlowDef"
    ADD CONSTRAINT "FlowDef_source_fkey" FOREIGN KEY (source) REFERENCES public."NodeDef"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2885 (class 2606 OID 16595)
-- Name: FlowDef FlowDef_target_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."FlowDef"
    ADD CONSTRAINT "FlowDef_target_fkey" FOREIGN KEY (target) REFERENCES public."NodeDef"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2886 (class 2606 OID 16600)
-- Name: Lane Lane_processDef_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Lane"
    ADD CONSTRAINT "Lane_processDef_fkey" FOREIGN KEY ("processDef") REFERENCES public."ProcessDef"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2889 (class 2606 OID 16615)
-- Name: NodeDef NodeDef_attachedToNode_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."NodeDef"
    ADD CONSTRAINT "NodeDef_attachedToNode_fkey" FOREIGN KEY ("attachedToNode") REFERENCES public."NodeDef"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2888 (class 2606 OID 16610)
-- Name: NodeDef NodeDef_lane_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."NodeDef"
    ADD CONSTRAINT "NodeDef_lane_fkey" FOREIGN KEY (lane) REFERENCES public."Lane"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2887 (class 2606 OID 16605)
-- Name: NodeDef NodeDef_processDef_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."NodeDef"
    ADD CONSTRAINT "NodeDef_processDef_fkey" FOREIGN KEY ("processDef") REFERENCES public."ProcessDef"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2890 (class 2606 OID 16620)
-- Name: NodeDef NodeDef_subProcessDef_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."NodeDef"
    ADD CONSTRAINT "NodeDef_subProcessDef_fkey" FOREIGN KEY ("subProcessDef") REFERENCES public."NodeDef"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2881 (class 2606 OID 16575)
-- Name: NodeInstance NodeInstance_nodeDef_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."NodeInstance"
    ADD CONSTRAINT "NodeInstance_nodeDef_fkey" FOREIGN KEY ("nodeDef") REFERENCES public."NodeDef"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2882 (class 2606 OID 16580)
-- Name: NodeInstance NodeInstance_processToken_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."NodeInstance"
    ADD CONSTRAINT "NodeInstance_processToken_fkey" FOREIGN KEY ("processToken") REFERENCES public."ProcessToken"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2880 (class 2606 OID 16570)
-- Name: NodeInstance NodeInstance_process_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."NodeInstance"
    ADD CONSTRAINT "NodeInstance_process_fkey" FOREIGN KEY (process) REFERENCES public."Process"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2892 (class 2606 OID 16630)
-- Name: ProcessToken ProcessToken_process_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."ProcessToken"
    ADD CONSTRAINT "ProcessToken_process_fkey" FOREIGN KEY (process) REFERENCES public."Process"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2891 (class 2606 OID 16625)
-- Name: Process Process_processDef_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Process"
    ADD CONSTRAINT "Process_processDef_fkey" FOREIGN KEY ("processDef") REFERENCES public."ProcessDef"(id) ON UPDATE CASCADE ON DELETE CASCADE;


-- Completed on 2018-04-09 09:29:36 CEST

--
-- PostgreSQL database dump complete
--

