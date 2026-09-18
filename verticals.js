// Each vertical shares the exact same detection engine (see
// hooks/useSimulation.js) — only the terminology and seed operators differ.
// This is the core of the "one engine, many prepaid systems" pitch: switching
// verticals swaps labels and data, never the scoring logic itself.

export const verticals = {
  electricity: {
    key: 'electricity',
    label: 'Electricity',
    tagline: 'Prepaid electricity vending',
    accountLabel: 'meter number',
    entityLabel: 'operator',
    entityLabelPlural: 'operators',
    unitLabel: 'token',
    unitLabelPlural: 'tokens',
    actionVerb: 'generated',
    locationLabel: 'depot',
    operators: [
      { id: 'OP-104', name: 'T. Mahlangu', depot: 'Soweto Depot', baseAmt: 180, sd: 35, freq: 1.0 },
      { id: 'OP-211', name: 'N. Dlamini', depot: 'Tembisa Depot', baseAmt: 150, sd: 28, freq: 1.1 },
      { id: 'OP-337', name: 'S. van Wyk', depot: 'Midrand Depot', baseAmt: 210, sd: 40, freq: 0.9 },
      { id: 'OP-058', name: 'K. Ndlovu', depot: 'Soweto Depot', baseAmt: 170, sd: 30, freq: 1.0 },
      { id: 'OP-412', name: 'R. Naidoo', depot: 'Alexandra Depot', baseAmt: 160, sd: 25, freq: 1.2 },
      { id: 'OP-090', name: 'B. Khumalo', depot: 'Tembisa Depot', baseAmt: 190, sd: 32, freq: 0.8 },
    ],
  },

  water: {
    key: 'water',
    label: 'Water',
    tagline: 'Prepaid water meter credits',
    accountLabel: 'meter number',
    entityLabel: 'meter operator',
    entityLabelPlural: 'meter operators',
    unitLabel: 'credit',
    unitLabelPlural: 'credits',
    actionVerb: 'issued',
    locationLabel: 'municipal office',
    operators: [
      { id: 'WT-018', name: 'P. Sithole', depot: 'Ekurhuleni Water Office', baseAmt: 140, sd: 26, freq: 1.0 },
      { id: 'WT-072', name: 'L. Botha', depot: 'Tshwane Water Office', baseAmt: 160, sd: 30, freq: 0.9 },
      { id: 'WT-133', name: 'A. Mokoena', depot: 'Ekurhuleni Water Office', baseAmt: 150, sd: 27, freq: 1.1 },
      { id: 'WT-206', name: 'F. Zulu', depot: 'Cape Town Water Office', baseAmt: 170, sd: 33, freq: 0.8 },
    ],
  },

  airtime: {
    key: 'airtime',
    label: 'Airtime & data',
    tagline: 'Prepaid airtime and data vouchers',
    accountLabel: 'SIM / account number',
    entityLabel: 'network agent',
    entityLabelPlural: 'network agents',
    unitLabel: 'voucher',
    unitLabelPlural: 'vouchers',
    actionVerb: 'issued',
    locationLabel: 'branch',
    operators: [
      { id: 'AG-301', name: 'M. Dube', depot: 'Bloemfontein Branch', baseAmt: 90, sd: 20, freq: 1.3 },
      { id: 'AG-317', name: 'S. Nkosi', depot: 'Polokwane Branch', baseAmt: 85, sd: 18, freq: 1.2 },
      { id: 'AG-355', name: 'T. Fourie', depot: 'Durban Branch', baseAmt: 100, sd: 22, freq: 1.1 },
      { id: 'AG-402', name: 'K. Radebe', depot: 'Bloemfontein Branch', baseAmt: 95, sd: 21, freq: 1.0 },
    ],
  },

  transit: {
    key: 'transit',
    label: 'Transit',
    tagline: 'Prepaid transit card top-ups',
    accountLabel: 'card number',
    entityLabel: 'conductor',
    entityLabelPlural: 'conductors',
    unitLabel: 'top-up',
    unitLabelPlural: 'top-ups',
    actionVerb: 'loaded',
    locationLabel: 'depot',
    operators: [
      { id: 'TR-011', name: 'B. Molefe', depot: 'Park Station Depot', baseAmt: 60, sd: 14, freq: 1.4 },
      { id: 'TR-044', name: 'C. Pretorius', depot: 'Bellville Depot', baseAmt: 55, sd: 12, freq: 1.3 },
      { id: 'TR-089', name: 'N. Mahlangu', depot: 'Park Station Depot', baseAmt: 65, sd: 15, freq: 1.2 },
    ],
  },

  grants: {
    key: 'grants',
    label: 'Social grants',
    tagline: 'Government grant vouchers',
    accountLabel: 'beneficiary ID',
    entityLabel: 'cashier',
    entityLabelPlural: 'cashiers',
    unitLabel: 'voucher',
    unitLabelPlural: 'vouchers',
    actionVerb: 'issued',
    locationLabel: 'pay point',
    operators: [
      { id: 'GR-201', name: 'V. Mahlangu', depot: 'Soshanguve Pay Point', baseAmt: 350, sd: 45, freq: 0.7 },
      { id: 'GR-233', name: 'D. Steyn', depot: 'Khayelitsha Pay Point', baseAmt: 340, sd: 42, freq: 0.8 },
      { id: 'GR-267', name: 'P. Ndlovu', depot: 'Soshanguve Pay Point', baseAmt: 360, sd: 48, freq: 0.6 },
    ],
  },

  retail: {
    key: 'retail',
    label: 'Retail gift cards',
    tagline: 'In-store gift card issuance',
    accountLabel: 'card number',
    entityLabel: 'cashier',
    entityLabelPlural: 'cashiers',
    unitLabel: 'gift card',
    unitLabelPlural: 'gift cards',
    actionVerb: 'issued',
    locationLabel: 'store',
    operators: [
      { id: 'RT-501', name: 'J. van der Merwe', depot: 'Sandton City Store', baseAmt: 220, sd: 38, freq: 1.0 },
      { id: 'RT-522', name: 'Z. Khumalo', depot: 'Menlyn Park Store', baseAmt: 200, sd: 34, freq: 1.1 },
      { id: 'RT-560', name: 'H. Adams', depot: 'Sandton City Store', baseAmt: 210, sd: 36, freq: 0.9 },
    ],
  },
}

export const verticalKeys = Object.keys(verticals)
