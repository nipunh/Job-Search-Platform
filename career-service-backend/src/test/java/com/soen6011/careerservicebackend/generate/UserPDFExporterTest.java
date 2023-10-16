package com.soen6011.careerservicebackend.generate;

import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.soen6011.careerservicebackend.model.Candidate;
import org.junit.jupiter.api.Test;
import org.springframework.util.Assert;

public class UserPDFExporterTest {

    private Candidate user = new Candidate("John", "Dow", "Masters", Integer.valueOf(3), null);

    private UserPDFExporter export = new UserPDFExporter(user);

    @Test
    public void testWriteTableHeader(){
        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100f);
        table.setWidths(new float[] {1.5f, 3.5f, 3.0f, 3.0f});
        table.setSpacingBefore(10);

        export.writeTableHeader(table);
        Assert.notNull(table);
        PdfPCell cells[] = table.getRow(0).getCells();
        Assert.isTrue(cells.length == 4);
    }


}
