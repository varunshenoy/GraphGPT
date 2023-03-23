export const STATEFUL_PROMPT = `Given the current state of a graph and a prompt, extrapolate as many relationships as possible from the prompt and update the state. Every node has an id, label, and color (in hex). Every edge has a to and from with node ids, and a label. Edges are directed, so the order of the from and to is important.

Examples:
current state:
{ "nodes": [ { "id": 1, "label": "Bob", "color": "#ffffff" } ], "edges": [] }

prompt: Alice is Bob's roommate. Make her node green.

new state:
{ "nodes": [ { "id": 1, "label": "Bob", "color": "#ffffff" }, { "id": 2, "label": "Alice", "color": "#ff7675" } ], "edges": [ { "from": 1, "to": 2, "label": "roommate" } ] }

current state:
$state

prompt: $prompt

new state: 

`;

export const STATELESS_PROMPT = `
Read the following article and pay attention to any mentions of power plants:
$prompt

In the article, find properties based on the following schema:
{
    'plant': name of plant
    'chinese_name': name of plant in Chinese
    'country': country location of the plant,
    'number_of_units': number of units in the plant,
    'owner': name(s) of the company(ies) that owns or finances the power plant; e.g. EDP,
    'capacity_mw': total capacity of the power plant in MW,
    'status': what is the plant's status at the moment of the article; e.g. operating, retired, cancelled, construction, pre_permit, shelved, paused,
    'combustion_technology': e.g. 'ultra-super',
    'location': more specific location of the power plant, such as a city, address, coordinates, etc; e.g. Av. Brasília, 1300-598 Lisboa, Portugal
    'region': region of the plant, could be continent e.g. Asia
}

If any property is unknown, unclear or unspecified, please report as 'null'.
Output all text in English.

Extrapolate as many relationships as possible from the properties found and create a new state. Every node has an id is key of the property, label is value, and color (in hex). Every edge has a to and from with node ids, and a label. Edges are directed, so the order of the from and to is important.

Example:

prompt: 8月6日9时16分，由中国能建浙江火电承建、华东电力试研院负责单体调试及单机试运的中电投分宜电厂扩建工程2号机组，一次通过168小时试运行。 试运期间，2号机组运行稳定，各参数均满足设计技术规范要求，机组自动投入率100%，保护投入率100%，主要仪表投入率100%，环保设施同步投入，汽轮发电机平均负荷达额定负荷的95%等各项指标优良，具备商业运行条件。 江西分宜电厂项目地处江西省新余市分宜县双林镇，建设2台66万千瓦超超临界燃煤发电机组，同步建设烟气脱硫、脱硝设施，是当前国内节能高效、绿色环保电厂，是江西省“十三五”建设的重大电力项目，建成后将有效缓解江西省用电紧张局面。.

new state:
{ "nodes": [ { "id": "plant", "label": "Anhui Bengbu power station", "color": "#ffffff" }, { "id": "country", "label": "China", "color": "#ff7675" } ], "edges": [ { "from": "plant", "to": "country", "label": "relationship" } ] }

new state: 
`;
