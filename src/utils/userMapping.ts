// Hardcoded user ID to name mapping
const USER_ID_TO_NAME: Record<string, string> = {
  "1804860": "Gabe",
  "2363178": "Sarah",
  "5409757": "Sarah",
  "7740503": "Kyra",
  "9296571": "Enrique",
  "11298302": "Daniel",
  "12130616": "Kevin",
  "251880768": "Ario",
  "1017908760": "Eric",
  "1000000017777": "Eumin",
  "1000000040175": "Eliana",
  "1000000122459": "David",
  "1000000129844": "Nathan",
  "1000000142370": "Kevin",
  "1000000178843": "Loren",
  "1000000240996": "Francesca",
  "1000000251504": "Tracey",
  "1000000260402": "Sterling",
  "1000000270938": "aren",
  "1000000273404": "Keith",
  "1000000283404": "Ashiya",
  "1000000287383": "Laura",
  "1000000326978": "Dylan",
  "1000000370558": "Niklas",
  "1000000395040": "Laura",
  "1000000396600": "Reena",
  "1000000400844": "Hayley",
  "1000000429887": "Morgan",
  "1000000504888": "Caro",
  "1000000515634": "Jamie",
  "1000000559382": "Ariana",
  "1000000632720": "Margot",
  "1000000785419": "Tomas",
  "1000000813863": "Brittany",
  "1000001166105": "Tim",
  "1000001178320": "Leah",
  "1000001267242": "Joshua",
  "1000001292440": "Anthony",
  "1000001296046": "Tom",
  "1000001317277": "Aaron",
  "1000001422272": "Ginevra",
  "1000001556823": "Kirill",
  "1000001558383": "Faisal",
  "1000001805422": "Stephen",
  "1000001838833": "Emma",
  "1000001882333": "Grace",
  "1000001883023": "Mikaela",
  "1000001969948": "Nicole",
  "1000002008668": "Will",
  "1000002288955": "Brandon",
  "1000002929181": "Chase",
  "10264309808": "Ben",
  "4000000000014": "Rob",
  "4000000000034": "Alan",
  "4000000000193": "Alex",
  "4000000000929": "Molly",
  "4000000000930": "Marley",
  "4000000000933": "Claire",
  "4000000001008": "Abigail",
  "4000000001779": "Sophie",
  "4000000001808": "Lauren",
  "4000000001955": "Melanie",
  "4000000002517": "Eddie",
  "4000000006379": "Flynn",
  "4000000006503": "Andy",
  "4000000007480": "Simon",
  "4000000008403": "Antonio",
  "4000000008542": "Eric",
  "4000000008573": "David",
  "4000000008810": "Ivan",
  "4000000008813": "Marie-Louise",
  "4000000009039": "Fabián",
  "4000000010301": "Yusuke",
  "4000000010497": "Max",
  "4000000010520": "Kwang",
  "4000000010521": "Daisuke",
  "4000000010637": "Bosco",
  "4000000010682": "Masha",
  "4000000010922": "Niki",
  "4000000010923": "Wolfgang",
  "4000000010924": "Olivia",
  "4000000010931": "Hisato",
  "4000000011006": "Jean",
  "4000000011090": "Mike",
  "4000000011358": "Elle",
  "4000000011513": "Phil",
  "4000000011702": "Mingoo",
  "4000000012107": "Steven",
  "4000000012329": "Garima",
  "4000000012620": "Dan",
  "4000000013011": "Grace",
  "4000000014546": "Esther"
};

/**
 * Build a map of userId to userName
 * Uses hardcoded mapping and optionally merges with conversation data
 */
export function buildUserMap(conversationData?: any): Map<string, string> {
  const userMap = new Map<string, string>();

  // First, populate with hardcoded mappings
  Object.entries(USER_ID_TO_NAME).forEach(([id, name]) => {
    userMap.set(id, name);
  });

  // Optionally merge in users from conversation data
  if (conversationData?.messages) {
    conversationData.messages.forEach((message: any) => {
      if (message.ui_components) {
        message.ui_components.forEach((component: any) => {
          if (component.placeList?.component?.mutablePlacesList) {
            component.placeList.component.mutablePlacesList.forEach((place: any) => {
              if (place.volatilePlaceData?.usersAddedList) {
                place.volatilePlaceData.usersAddedList.forEach((user: any) => {
                  if (user.id && user.name && !userMap.has(user.id)) {
                    userMap.set(user.id, user.name);
                  }
                });
              }
            });
          }
        });
      }
    });
  }

  return userMap;
}
