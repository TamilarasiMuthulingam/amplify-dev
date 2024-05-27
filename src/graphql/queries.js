
export const getAllRecords1=`
query MyQuery {
 getAllRecords1 {
   Address
   Name
   Organization
   SerialNumber
 }
}
`

export const getAllRecords2=`
 query MyQuery {
  getAllRecords2 {
   ObjectMap
   Points
  }
}
`
export const getAllRecords3=`
query MyQuery {
 getAllRecords3 {
   Dimension
   PointMap
   Timestamp
   Unit
   Value
 }
}
`
export const getAllEquipmentsBySerialNumber=`
query MyQuery {
 getAllEquipmentsBySerialNumber {
   items {
     PointMap
     Timestamp
     Unit
     Value
   }
 }
}
`
//(filter: {ObjectMap: {beginsWith: "E08E60850#area" }})
export const getAllEquipmentNamesBySerialNumber=`
query MyQuery($serialNumber:String!) {
 getAllEquipmentNamesBySerialNumber(filter: {ObjectMap: {beginsWith: $serialNumber}}) {
   items {
     ObjectMap
   }
 }
}
`

export const getTodayRecords=`
query MyQuery {
 getAllRecords4 {
   todayRecords) {
     items {
       Value
       Unit
       Timestamp
       PointMap
       Dimension
     }
   }
 }
}

`
export const getMonthRecords=`
query MyQuery {
 getAllRecords4 {
   thisMonthRecords {
     items {
       Value
       Dimension
       PointMap
       Timestamp
       Unit
     }
   }
 }
}
`

export const getCustomRange=`

query MyQuery ($startDate: String!, $endDate: String!){
 getAllRecords4 {
   CustomRange(filter: { Timestamp: { between: [$startDate, $endDate] } }) {
     items {
       Dimension
       Value
       Unit
       Timestamp
       PointMap
     }
   }
 }
}
`


export const latestTimeStamp = `
  query MyQuery($serialNumber:String!) {
    getAllRecords4 {
      LatestTimestamp(filter: {PointMap: {beginsWith: $serialNumber}}) {
        items {
          PointMap
          Dimension
          Timestamp
          Unit
          Value
        }
      }
    }
  }
`;

export const AllfamilyEquipment = `
query MyQuery($serialNumber:String!) {
  getAllRecords4 {
    AllfamilyEquipment (filter: {PointMap: {beginsWith: $serialNumber}}){
      items {
        Dimension
        PointMap
        Timestamp
        Unit
        Value
      }
    }
  }
}

`;


export const AllEquipmentList=
`
query MyQuery($serialNumber: String!, $FamilyType: String!) {
  getAllRecords4 {
    AllEquipmentList(filter: {PointMap: {contains: $FamilyType, beginsWith: $serialNumber } }) {
      items {
        PointMap
        Dimension
        Timestamp
        Unit
        Value
      }
    }
  }
}
`
export const getAllEquipmentList=
`
query MyQuery($serialNumber: String!, $FamilyType: String!) {
  getAllEquipmentList(filter: {ObjectMap: {contains: $FamilyType, beginsWith: $serialNumber }}) {
    items {
      ObjectMap
      Points
    }
  }
}
`

export const getAllEquipmentSummary=`

query MyQuery($serialNumber: String!) {
  getAllEquipmentSummary(filter: {ObjectMap: {contains:$serialNumber}}) {
    items {
      ObjectMap
      Points
    }
  }
}
`
