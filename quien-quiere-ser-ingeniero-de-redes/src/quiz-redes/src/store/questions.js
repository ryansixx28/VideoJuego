export function loadQuestions(level){
  const base = {
    CCNA: [
      { text: '¿Qué capa del modelo OSI corresponde al protocolo IP?', options: ['Transporte','Red','Enlace de datos','Aplicación'], answer: 1 },
      { text: '¿Cuál es el rango de una dirección privada clase C?', options: ['10.0.0.0/8','172.16.0.0/12','192.168.0.0/16','169.254.0.0/16'], answer: 2 },
      { text: 'Comando para ver tabla ARP en Cisco IOS', options: ['show ip interface brief','show arp','show mac address-table','show ip route'], answer: 1 },
    ],
    CCNP: [
      { text: '¿Qué algoritmo usa OSPF para calcular rutas?', options: ['Bellman-Ford','Dijkstra (SPF)','Path Vector','Flooding'], answer: 1 },
      { text: 'BGP estado que indica intercambio de rutas establecido', options: ['OpenSent','Connect','Established','Active'], answer: 2 },
      { text: '¿Qué es HSRP?', options: ['Enrutamiento dinámico','Protocolo de redundancia de gateway','Balanceador L7','STP rápido'], answer: 1 },
    ],
    CCIE: [
      { text: '¿Qué campo en IPv6 reemplaza el checksum de capa 3?', options: ['Flow Label','Next Header','Traffic Class','Ninguno (se quitó en IPv6)'], answer: 3 },
      { text: '¿Qué hace LACP en port-channels?', options: ['Asignar VLANs','Negociar agregación de enlaces','Autenticar BGP','Filtrar multicast'], answer: 1 },
      { text: 'VXLAN usa típicamente el puerto UDP', options: ['4789','179','67','443'], answer: 0 },
    ]
  }
  return base[level] || []
}
