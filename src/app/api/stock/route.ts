

import { NextResponse } from 'next/server';
import { GoogleSpreadsheet } from 'google-spreadsheet';

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID!;
const CLIENT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL!;
const PRIVATE_KEY = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY!.replace(/\n/g, '\n');

const doc = new GoogleSpreadsheet(SPREADSHEET_ID);

async function accessSpreadsheet() {
  await doc.useServiceAccountAuth({
    client_email: CLIENT_EMAIL,
    private_key: PRIVATE_KEY,
  });
  await doc.loadInfo();
  return doc.sheetsByIndex[0];
}

export async function GET() {
  try {
    const sheet = await accessSpreadsheet();
    const rows = await sheet.getRows();

    const returned = {
      inner: 0,
      shortSleeve: 0,
      longSleeve: 0,
      pants: 0,
    };

    rows.forEach(row => {
      returned.inner += Number(row.get('肌着（持ち帰り）') || 0);
      returned.shortSleeve += Number(row.get('上着（半袖）（持ち帰り）') || 0);
      returned.longSleeve += Number(row.get('上着（長袖）（持ち帰り）') || 0);
      returned.pants += Number(row.get('ズボン（持ち帰り）') || 0);
    });

    const stock = {
      inner: 3 - returned.inner,
      shortSleeve: 3 - returned.shortSleeve,
      longSleeve: 3 - returned.longSleeve,
      pants: 3 - returned.pants,
    };

    const toBring = {
      inner: returned.inner,
      shortSleeve: returned.shortSleeve,
      longSleeve: returned.longSleeve,
      pants: returned.pants,
    };

    return NextResponse.json({ stock, toBring });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

