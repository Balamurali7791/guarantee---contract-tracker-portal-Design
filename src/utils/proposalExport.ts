/**
 * Proposal Document Exporter for Word (.doc format formatted in HTML/MSO XML)
 * Compatible with Microsoft Word (.docx/.doc), Google Docs, and LibreOffice Writer.
 * Uses standard Calibri typography, executive formatting, tables, and full project specification.
 */

export function generateProposalWordDocument(): void {
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const content = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset="utf-8">
  <title>System Proposal - Enterprise Guarantee & Contract Tracking Portal</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page Section1 {
      size: 8.5in 11.0in;
      margin: 1.0in 1.0in 1.0in 1.0in;
      mso-header-margin: 0.5in;
      mso-footer-margin: 0.5in;
      mso-paper-source: 0;
    }
    div.Section1 {
      page: Section1;
    }
    body {
      font-family: 'Calibri', 'Carlito', Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.35;
      color: #1e293b;
      margin: 0;
      padding: 0;
    }
    h1 {
      font-family: 'Calibri', 'Carlito', Arial, sans-serif;
      font-size: 22pt;
      font-weight: bold;
      color: #0b1528;
      margin-top: 24pt;
      margin-bottom: 6pt;
      border-bottom: 2pt solid #d97706;
      padding-bottom: 4pt;
    }
    h2 {
      font-family: 'Calibri', 'Carlito', Arial, sans-serif;
      font-size: 14pt;
      font-weight: bold;
      color: #0f213f;
      margin-top: 18pt;
      margin-bottom: 6pt;
      border-bottom: 1pt solid #cbd5e1;
      padding-bottom: 3pt;
    }
    h3 {
      font-family: 'Calibri', 'Carlito', Arial, sans-serif;
      font-size: 12pt;
      font-weight: bold;
      color: #1e3a8a;
      margin-top: 12pt;
      margin-bottom: 4pt;
    }
    p, li {
      font-family: 'Calibri', 'Carlito', Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.4;
      margin-top: 0pt;
      margin-bottom: 6pt;
    }
    .cover-box {
      background-color: #0b1528;
      color: #ffffff;
      padding: 30pt;
      margin-bottom: 25pt;
      border-left: 6pt solid #d97706;
    }
    .cover-title {
      font-family: 'Calibri', 'Carlito', Arial, sans-serif;
      font-size: 26pt;
      font-weight: bold;
      color: #ffffff;
      margin: 0;
      line-height: 1.2;
    }
    .cover-subtitle {
      font-size: 13pt;
      color: #fcd34d;
      margin-top: 8pt;
      font-weight: 500;
    }
    .cover-meta {
      margin-top: 25pt;
      font-size: 10.5pt;
      color: #94a3b8;
      border-top: 1pt solid #334155;
      padding-top: 10pt;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10pt;
      margin-bottom: 14pt;
      font-size: 10pt;
    }
    th {
      background-color: #0b1528;
      color: #f8fafc;
      font-weight: bold;
      text-align: left;
      padding: 6pt 8pt;
      border: 1pt solid #0b1528;
      font-size: 10pt;
    }
    td {
      padding: 5pt 8pt;
      border: 1pt solid #cbd5e1;
      vertical-align: top;
      font-size: 10pt;
    }
    tr:nth-child(even) td {
      background-color: #f8fafc;
    }
    .badge {
      display: inline-block;
      padding: 2pt 6pt;
      font-size: 9pt;
      font-weight: bold;
      border-radius: 3pt;
    }
    .badge-gold {
      background-color: #fef3c7;
      color: #92400e;
      border: 1pt solid #f59e0b;
    }
    .badge-blue {
      background-color: #e0f2fe;
      color: #075985;
      border: 1pt solid #38bdf8;
    }
    .badge-green {
      background-color: #dcfce7;
      color: #166534;
      border: 1pt solid #4ade80;
    }
    .callout {
      background-color: #fffbeb;
      border-left: 4pt solid #f59e0b;
      padding: 10pt 12pt;
      margin: 12pt 0;
    }
    .footer-note {
      font-size: 9pt;
      color: #64748b;
      border-top: 1pt solid #e2e8f0;
      padding-top: 6pt;
      margin-top: 20pt;
    }
  </style>
</head>
<body>
<div class="Section1">

  <!-- COVER PAGE BLOCK -->
  <div class="cover-box">
    <div class="cover-title">PROJECT PROPOSAL &amp; SYSTEM SPECIFICATION</div>
    <div class="cover-subtitle">Enterprise Bank Guarantee &amp; Contract Registry System (Treasury Portal)</div>
    <div class="cover-meta">
      <strong>Prepared For:</strong> Executive Client Management &amp; Treasury Directorate<br>
      <strong>Document Version:</strong> 1.0 (Formal Deliverable)<br>
      <strong>Date of Proposal:</strong> ${dateStr}<br>
      <strong>Classification:</strong> Commercial-in-Confidence
    </div>
  </div>

  <!-- EXECUTIVE SUMMARY -->
  <h1>1. Executive Summary</h1>
  <p>
    Modern commercial operations, infrastructure procurement, and enterprise project engagements necessitate rigorous control over performance securities, tender securities, and financial bonds. The <strong>Enterprise Bank Guarantee &amp; Contract Registry System</strong> is an institutional-grade treasury and compliance portal engineered to replace disconnected, error-prone manual spreadsheets with an authoritative, centralized custody ledger.
  </p>
  <p>
    This web platform captures all <strong>17 critical statutory and commercial parameters</strong> associated with performance bonds, advance payment guarantees, retention bonds, tender bonds, and customs indemnities. The system eliminates risk of financial loss stemming from unnoticed validity expirations, missing physical originals, untracked extension amendments, or unauthorized custody releases.
  </p>

  <div class="callout">
    <strong>Strategic Business Value:</strong> Provides instant portfolio visibility, automated threshold expiration alerts, 1-click Excel bulk importation, verified audit-trail exports, and physical bullion/safe custody tracking across all enterprise business units.
  </div>

  <!-- BUSINESS CHALLENGES & SOLUTION -->
  <h1>2. Business Problem &amp; Proposed Solution</h1>
  <table>
    <thead>
      <tr>
        <th style="width: 50%;">Current Spreadsheet Inefficiencies</th>
        <th style="width: 50%;">Treasury Portal Solution</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Risk of Lapse / Expiration:</strong> Guarantees lapse silently without alerting project teams, forfeiting claim rights.</td>
        <td><strong>Automated Countdown &amp; Expiry Engine:</strong> Visual status badges (Active, Expiring Soon &le;30d, Expired, Claimed, Released) with real-time day counters.</td>
      </tr>
      <tr>
        <td><strong>Displaced Physical Originals:</strong> Bank guarantees are physical securities; losing originals prevents claim execution.</td>
        <td><strong>Safe &amp; Bullion Custodia Tracking:</strong> Parameter #17 logs the exact physical safe location, vault reference, and custodian officer.</td>
      </tr>
      <tr>
        <td><strong>Formula &amp; Typing Inaccuracies:</strong> Discrepancies between project numbers, issuing banks, and currency values.</td>
        <td><strong>Mandatory 17-Parameter Schema:</strong> Strict field validation, ISO currency handling, and auto-generated tracker references (TRK-YYYY-XXXX).</td>
      </tr>
      <tr>
        <td><strong>Slow Reporting &amp; Audit Latency:</strong> Compiling multi-entity guarantee balances takes days for auditors.</td>
        <td><strong>Real-Time Metric Dashboard &amp; Multi-Format Export:</strong> Instant portfolio valuation, filtered multi-row selection, and 1-click Excel/CSV export.</td>
      </tr>
    </tbody>
  </table>

  <!-- COMPLETE 17 PARAMETER ARCHITECTURE -->
  <h1>3. The 17-Parameter Statutory Ledger Schema</h1>
  <p>
    The portal standardizes every instrument into a structured 17-point regulatory registry conforming to standard banking and FIDIC/EPC commercial contract governance:
  </p>
  <table>
    <thead>
      <tr>
        <th style="width: 8%;">No.</th>
        <th style="width: 25%;">Parameter Field</th>
        <th style="width: 17%;">Data Type</th>
        <th style="width: 50%;">Operational Purpose &amp; Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>1</strong></td>
        <td><strong>Tracker Reference No</strong></td>
        <td>Alphanumeric (Unique)</td>
        <td>Auto-generated unique registry serial (e.g. <code>TRK-2026-1048</code>) for cross-indexing and ledger indexing.</td>
      </tr>
      <tr>
        <td><strong>2</strong></td>
        <td><strong>Receiving Date</strong></td>
        <td>Date (YYYY-MM-DD)</td>
        <td>Exact timestamp when the original physical guarantee was lodged into company possession.</td>
      </tr>
      <tr>
        <td><strong>3</strong></td>
        <td><strong>Company Name</strong></td>
        <td>Text / Select</td>
        <td>Holding entity or corporate subsidiary that is the registered Beneficiary of the instrument.</td>
      </tr>
      <tr>
        <td><strong>4</strong></td>
        <td><strong>Project Number</strong></td>
        <td>String (Unique)</td>
        <td>Internal project ERP / WBS accounting code tying the guarantee to capital expenditure or contract.</td>
      </tr>
      <tr>
        <td><strong>5</strong></td>
        <td><strong>Project Name</strong></td>
        <td>Text</td>
        <td>Descriptive official operational name of the infrastructure works, supply, or service agreement.</td>
      </tr>
      <tr>
        <td><strong>6</strong></td>
        <td><strong>Contractor Type</strong></td>
        <td>Category</td>
        <td>Classification of party (e.g., Main Contractor, Subcontractor, Consortium, Joint Venture, Vendor).</td>
      </tr>
      <tr>
        <td><strong>7</strong></td>
        <td><strong>Contractor Name</strong></td>
        <td>Text</td>
        <td>Official registered corporate entity name of the contractor or supplier providing the bond.</td>
      </tr>
      <tr>
        <td><strong>8</strong></td>
        <td><strong>Currency</strong></td>
        <td>ISO 4217 (3-Letter)</td>
        <td>Instrument currency code (USD, EUR, GBP, SAR, AED, QAR, INR, SGD, AUD, KWD, OMR, etc.).</td>
      </tr>
      <tr>
        <td><strong>9</strong></td>
        <td><strong>Guarantee Type</strong></td>
        <td>Standardized List</td>
        <td>Classification: Performance Guarantee, Advance Payment, Retention, Tender Bond, Customs Bond, Maintenance.</td>
      </tr>
      <tr>
        <td><strong>10</strong></td>
        <td><strong>Issuing Bank Name</strong></td>
        <td>Text / Institution</td>
        <td>Name of the licensed financial institution issuing or confirming the legal instrument.</td>
      </tr>
      <tr>
        <td><strong>11</strong></td>
        <td><strong>Issuing Bank Branch</strong></td>
        <td>Text</td>
        <td>Specific branch or corporate banking unit managing the counter-guarantee or issuance.</td>
      </tr>
      <tr>
        <td><strong>12</strong></td>
        <td><strong>Guarantee Ref Number</strong></td>
        <td>Alphanumeric</td>
        <td>Official instrument reference number assigned by the issuing bank on the face of the document.</td>
      </tr>
      <tr>
        <td><strong>13</strong></td>
        <td><strong>Guarantee Value</strong></td>
        <td>Numeric (Decimal)</td>
        <td>Face monetary limit guaranteed by the issuing bank under the instrument terms.</td>
      </tr>
      <tr>
        <td><strong>14</strong></td>
        <td><strong>From Date (FD)</strong></td>
        <td>Date (Effective)</td>
        <td>Inception date from which the guarantee becomes legally enforceable.</td>
      </tr>
      <tr>
        <td><strong>15</strong></td>
        <td><strong>To Date (TD)</strong></td>
        <td>Date (Maturity)</td>
        <td>Absolute expiry date before which any invocation or claim must be served upon the bank.</td>
      </tr>
      <tr>
        <td><strong>16</strong></td>
        <td><strong>Guarantee Status</strong></td>
        <td>State Machine</td>
        <td>Current operational status: <em>Active, Expiring Soon, Expired, Released, Claimed, In Process, Under Invocation</em>.</td>
      </tr>
      <tr>
        <td><strong>17</strong></td>
        <td><strong>Custodia (Vault Location)</strong></td>
        <td>Physical Location</td>
        <td>Designated physical safe, fireproof cabinet, vault box reference, and accountable key custodian.</td>
      </tr>
    </tbody>
  </table>

  <!-- CORE SYSTEM CAPABILITIES -->
  <h1>4. Comprehensive Functional Capabilities</h1>

  <h3>4.1. Intelligent Expiration &amp; Validity Monitoring</h3>
  <ul>
    <li><strong>Active Monitoring:</strong> Automatically calculates days remaining to maturity (TD) against real-time system clock.</li>
    <li><strong>Tiered Visual Indicators:</strong> Highlighting critical thresholds: <code>Active</code> (&gt;30 days), <code>Expiring Soon</code> (&le;30 days), and <code>Expired</code> (&lt;0 days).</li>
    <li><strong>Special Claim States:</strong> Supports legal operational states including <em>Under Invocation</em>, <em>Claimed</em>, and <em>Released</em> to prevent premature disposal of securities.</li>
  </ul>

  <h3>4.2. Seamless Excel / CSV Spreadsheet Interoperability</h3>
  <ul>
    <li><strong>Drag-and-Drop Ingestion:</strong> Ingests legacy spreadsheets (<code>.xlsx</code>, <code>.xls</code>, <code>.csv</code>) instantly.</li>
    <li><strong>Dynamic Column Auto-Mapping:</strong> Intelligently recognizes varied header naming conventions (e.g. "To Date", "TD", "Expiry Date", "Maturity").</li>
    <li><strong>Pre-Commit Validation:</strong> Validates date formats, numeric amounts, and highlights format warnings in a live preview table prior to ingestion.</li>
    <li><strong>Standardized Template:</strong> Provides a 1-click downloadable pre-formatted Excel template complete with sample rows and column headers.</li>
  </ul>

  <h3>4.3. Interactive Registry &amp; Multi-Faceted Filtering</h3>
  <ul>
    <li><strong>Universal Full-Text Search:</strong> Real-time filtering across reference numbers, project titles, contractor names, banks, and vault locations.</li>
    <li><strong>Multi-Dimensional Dropdowns:</strong> Filter by Beneficiary Company, Status, Guarantee Type, and Custodia Vault.</li>
    <li><strong>Bidirectional Sorting:</strong> Click-to-sort across all numeric values, inception/expiry dates, and reference codes.</li>
    <li><strong>Batch Actions:</strong> Multi-row selection for filtered reporting, batch Excel export, and bulk deletion.</li>
  </ul>

  <h3>4.4. Detailed Audit Drawer &amp; Printable Lodgement Slip</h3>
  <ul>
    <li><strong>Quick-Slide Inspection Drawer:</strong> Non-intrusive full specification inspection without page reload.</li>
    <li><strong>Printable Custody Lodgement Slip:</strong> 1-click printable receipt for handover between Project Managers and Treasury Custodians, verifying physical deposit of original bank documents into vaults.</li>
  </ul>

  <!-- TECHNICAL ARCHITECTURE -->
  <h1>5. Technical Architecture &amp; System Design</h1>
  <table>
    <thead>
      <tr>
        <th style="width: 30%;">Component</th>
        <th style="width: 70%;">Specification &amp; Technology Stack</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Frontend Engine</strong></td>
        <td>React 19, TypeScript 5.8+, Vite 8 (Ultra-fast client build and execution).</td>
      </tr>
      <tr>
        <td><strong>Styling &amp; Typography</strong></td>
        <td>Tailwind CSS with executive Navy &amp; Gold colorway; Universal corporate <strong>Calibri / Carlito</strong> typography.</td>
      </tr>
      <tr>
        <td><strong>Data Processing</strong></td>
        <td>SheetJS (XLSX) client engine for fast spreadsheet parsing and export without external cloud data leakage.</td>
      </tr>
      <tr>
        <td><strong>Iconography &amp; UI</strong></td>
        <td>Lucide-React enterprise icon suite, clean tabular figure alignments, responsive drawer and modal overlays.</td>
      </tr>
      <tr>
        <td><strong>Data Security</strong></td>
        <td>Client-side sandbox processing guarantees strict commercial confidentiality with zero third-party tracking.</td>
      </tr>
    </tbody>
  </table>

  <!-- IMPLEMENTATION TIMELINE & MILESTONES -->
  <h1>6. Implementation Roadmap &amp; Deliverables</h1>
  <table>
    <thead>
      <tr>
        <th style="width: 20%;">Phase</th>
        <th style="width: 45%;">Activities &amp; Scope</th>
        <th style="width: 35%;">Deliverables</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Phase 1: Inception &amp; Setup</strong></td>
        <td>Requirements sign-off, schema finalization, corporate identity adaptation, and hosting provisioning.</td>
        <td>Final System Architecture Document &amp; Base Environment.</td>
      </tr>
      <tr>
        <td><strong>Phase 2: Legacy Migration</strong></td>
        <td>Extraction, cleansing, and automated batch ingestion of historical Excel guarantee records.</td>
        <td>Verified Baseline Database &amp; Data Audit Log.</td>
      </tr>
      <tr>
        <td><strong>Phase 3: UAT &amp; Security</strong></td>
        <td>User acceptance testing by Treasury and Commercial Legal teams; lodgement workflow verification.</td>
        <td>UAT Sign-off &amp; Treasury User Manual.</td>
      </tr>
      <tr>
        <td><strong>Phase 4: Go-Live &amp; Training</strong></td>
        <td>System handover, physical custody protocol roll-out, and administrative user training.</td>
        <td>Production System Access &amp; Operational SLA.</td>
      </tr>
    </tbody>
  </table>

  <!-- COMMERCIAL TERMS & SIGN-OFF -->
  <h1>7. Acceptance &amp; Authorization</h1>
  <p>
    This proposal represents the full operational and technical scope for deploying the <strong>Enterprise Guarantee &amp; Contract Tracker Portal</strong>. To proceed with implementation, authorized representatives of both parties are invited to sign below:
  </p>

  <table style="margin-top: 30pt; border: none;">
    <tr style="background: none;">
      <td style="width: 50%; border: none; padding-right: 25pt;">
        <p><strong>For the Client:</strong></p>
        <p style="margin-top: 35pt; border-bottom: 1pt solid #475569;"></p>
        <p>Authorized Signature</p>
        <p>Name: _________________________________</p>
        <p>Title: __________________________________</p>
        <p>Date: __________________________________</p>
      </td>
      <td style="width: 50%; border: none; padding-left: 25pt;">
        <p><strong>For the Provider:</strong></p>
        <p style="margin-top: 35pt; border-bottom: 1pt solid #475569;"></p>
        <p>Authorized Signature</p>
        <p>Name: _________________________________</p>
        <p>Title: __________________________________</p>
        <p>Date: __________________________________</p>
      </td>
    </tr>
  </table>

  <div class="footer-note">
    Enterprise Bank Guarantee &amp; Contract Registry System &bull; Confidential &bull; Standard Typography: Calibri &bull; Generated: ${dateStr}
  </div>

</div>
</body>
</html>
  `;

  // Create Word document Blob (.doc MIME type formatted as valid HTML MSOffice)
  const blob = new Blob(['\ufeff', content], {
    type: 'application/msword;charset=utf-8',
  });

  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = `System_Proposal_Guarantee_Contract_Tracker_${new Date().toISOString().split('T')[0]}.doc`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
}
