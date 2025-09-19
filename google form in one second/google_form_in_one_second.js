function createQuizFormFromCSV() {
  // Load CSV file from Google Drive
  var file = DriveApp.getFilesByName("mcq1.csv").next();
  var csvData = Utilities.parseCsv(file.getBlob().getDataAsString());

  // Create Google Form
  var form = FormApp.create("MCQ Quiz from CSV");
  form.setIsQuiz(true);

  // Define types that support quiz points
  var pointSupportedTypes = ["MCQ", "CHECKBOX", "TEXT", "PARAGRAPH", "SCALE"];

  // Loop through rows (skip header)
  for (var i = 1; i < csvData.length; i++) {
    var row = csvData[i];
    if (row.length < 2) continue; // Skip incomplete rows

    var questionText = row[0];
    var type = row[1] ? row[1].toUpperCase() : "";
    var options = [row[2], row[3], row[4], row[5]];
    var correct = row[6];
    var points = row[7] && row[7] !== "NO" ? parseInt(row[7], 10) : null;
    var required = row[8] && row[8].toUpperCase() === "YES";
    var shuffle = row[9] && row[9].toUpperCase() === "YES";
    var description = row[10] && row[10] !== "NO" ? row[10] : "";
    var helpText = row[11] && row[11] !== "NO" ? row[11] : "";
    var scaleMin = row[12] && row[12] !== "NO" ? parseInt(row[12], 10) : 1;
    var scaleMax = row[13] && row[13] !== "NO" ? parseInt(row[13], 10) : 5;
    var gridRows = row[14] && row[14] !== "NO" ? row[14].split("|") : [];
    var gridCols = row[15] && row[15] !== "NO" ? row[15].split("|") : [];
    var mediaUrl = row[16] && row[16] !== "NO" ? row[16] : "";

    if (!questionText) continue;

    var item = null;

    switch (type) {
      case "MCQ":
        var mcqOpts = options.filter(o => o && o.toUpperCase() !== "NO");
        if (mcqOpts.length === 0) continue;
        item = form.addMultipleChoiceItem().setTitle(questionText);
        var mcqChoices = mcqOpts.map(opt => item.createChoice(opt, opt === correct));
        item.setChoices(mcqChoices);
        break;

      case "CHECKBOX":
        var cbOpts = options.filter(o => o && o.toUpperCase() !== "NO");
        if (cbOpts.length === 0) continue;
        item = form.addCheckboxItem().setTitle(questionText);
        var cbChoices = cbOpts.map(opt =>
          item.createChoice(opt, correct && correct.split(";").includes(opt))
        );
        item.setChoices(cbChoices);
        break;

      case "TEXT":
        item = form.addTextItem().setTitle(questionText);
        break;

      case "PARAGRAPH":
        item = form.addParagraphTextItem().setTitle(questionText);
        break;

      case "SCALE":
        item = form.addScaleItem()
          .setTitle(questionText)
          .setBounds(scaleMin, scaleMax);
        break;

      case "GRID":
        if (gridRows.length && gridCols.length) {
          var gridTitle = questionText + (points ? " (Points: " + points + ")" : "");
          item = form.addGridItem().setTitle(gridTitle).setRows(gridRows).setColumns(gridCols);
        }
        break;

      case "CHECKBOX_GRID":
        if (gridRows.length && gridCols.length) {
          var gridTitleCB = questionText + (points ? " (Points: " + points + ")" : "");
          item = form.addCheckboxGridItem().setTitle(gridTitleCB).setRows(gridRows).setColumns(gridCols);
        }
        break;

      case "DATE":
        item = form.addDateItem().setTitle(questionText + (points ? " (Points: " + points + ")" : ""));
        break;

      case "TIME":
        item = form.addTimeItem().setTitle(questionText + (points ? " (Points: " + points + ")" : ""));
        break;

      case "IMAGE":
        if (mediaUrl) {
          try {
            var imgResponse = UrlFetchApp.fetch(mediaUrl, { muteHttpExceptions: true });
            if (imgResponse.getResponseCode() === 200) {
              var imgBlob = imgResponse.getBlob();
              item = form.addImageItem().setTitle(questionText + (points ? " (Points: " + points + ")" : ""));
              item.setImage(imgBlob);
            } else {
              Logger.log("⚠️ Image not found for: " + questionText + " (" + mediaUrl + ")");
            }
          } catch (e) {
            Logger.log("❌ Error fetching image for: " + questionText + " -> " + e);
          }
        }
        break;

      case "VIDEO":
        if (mediaUrl) {
          try {
            if (mediaUrl.includes("youtube.com") || mediaUrl.includes("youtu.be")) {
              item = form.addVideoItem().setTitle(questionText + (points ? " (Points: " + points + ")" : ""));
              item.setVideoUrl(mediaUrl);
            } else {
              Logger.log("⚠️ Invalid video URL for: " + questionText + " (" + mediaUrl + ")");
            }
          } catch (e) {
            Logger.log("❌ Error adding video for: " + questionText + " -> " + e);
          }
        }
        break;

      case "SECTION":
        item = form.addSectionHeaderItem().setTitle(questionText);
        break;

      case "PAGE_BREAK":
        item = form.addPageBreakItem().setTitle(questionText);
        break;

      default:
        Logger.log("Unknown type: " + type + " for question: " + questionText);
        continue;
    }

    // Apply common properties
    if (item) {
      if (description) item.setTitle(item.getTitle() + "\n" + description);
      if (helpText && item.setHelpText) item.setHelpText(helpText);

      // Only apply points where supported
      if (points !== null) {
        if (pointSupportedTypes.includes(type) && item.setPoints) {
          item.setPoints(points);
        }
        // else: already appended to title for unsupported
      }

      if (required && item.setRequired) item.setRequired(true);
      if (shuffle && item.setShuffleOptions) item.setShuffleOptions(true);
    }
  }

  Logger.log("✅ Form created: " + form.getEditUrl());
}