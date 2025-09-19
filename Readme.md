---

````markdown
# Google Form Quiz Generator from CSV

This Google Apps Script automatically creates a **Google Form Quiz** using questions stored in a CSV file on Google Drive.  
It supports **MCQ, Checkbox, Text, Paragraph, Scale, Grid, Checkbox Grid, Date, Time, Image, Video, Section, and Page Break** question types.

---

## 🚀 Features
- Reads questions from a CSV file (`mcq1.csv`) stored in Google Drive.
- Supports multiple question types:
  - **MCQ** (single answer)
  - **Checkbox** (multiple answers)
  - **Text / Paragraph**
  - **Scale (rating 1–5)**
  - **Grid & Checkbox Grid**
  - **Date / Time pickers**
  - **Image & Video (YouTube only)**
  - **Section & Page breaks**
- Automatically sets:
  - Correct answers
  - Points
  - Required fields
  - Shuffle options
  - Descriptions and help text

---

## 📂 CSV Format

Each row in the CSV represents **one question**.  
Columns must follow this order:

| Column | Description |
|--------|-------------|
| 0 | **Question Text** |
| 1 | **Type** (MCQ, CHECKBOX, TEXT, PARAGRAPH, SCALE, GRID, CHECKBOX_GRID, DATE, TIME, IMAGE, VIDEO, SECTION, PAGE_BREAK) |
| 2–5 | **Options** (for MCQ/Checkbox only, up to 4) |
| 6 | **Correct Answer** (single answer for MCQ, multiple with `;` for Checkbox) |
| 7 | **Points** (leave `NO` if not applicable) |
| 8 | **Required** (YES/NO) |
| 9 | **Shuffle Options** (YES/NO) |
| 10 | **Description** (extra text under title) |
| 11 | **Help Text** (hints) |
| 12 | **Scale Min** (for SCALE type, default 1) |
| 13 | **Scale Max** (for SCALE type, default 5) |
| 14 | **Grid Rows** (separate with `|`) |
| 15 | **Grid Columns** (separate with `|`) |
| 16 | **Media URL** (image/video URL, YouTube only for video) |

---

### 📝 Example CSV

```csv
Question,Type,Option1,Option2,Option3,Option4,Correct,Points,Required,Shuffle,Description,Help,ScaleMin,ScaleMax,GridRows,GridCols,MediaURL
What is 2+2?,MCQ,2,3,4,5,4,5,YES,YES,Simple math,,NO,NO,NO,NO,NO
Select prime numbers,CHECKBOX,2,3,4,6,"2;3",5,NO,YES,Math concept,,NO,NO,NO,NO,NO
Rate your satisfaction,SCALE,,,,,NO,3,NO,NO,,,"1","5",NO,NO,NO
Upload proof of work,IMAGE,,,,,NO,NO,NO,NO,,,"NO","NO",NO,NO,https://example.com/image.png
Watch this tutorial,VIDEO,,,,,NO,NO,NO,NO,,,"NO","NO",NO,NO,https://www.youtube.com/watch?v=dQw4w9WgXcQ
````

---

## ⚙️ Setup Instructions

1. Open [Google Apps Script](https://script.google.com/).
2. Create a new project.
3. Copy the script from [`createQuizFormFromCSV`](./createQuizFormFromCSV.gs) into the editor.
4. Save the project.
5. Upload your `mcq1.csv` file into Google Drive.
6. Run the script:

   * First run will ask for **permissions** → allow them.
   * After execution, the log will show:

     ```
     ✅ Form created: <EDIT_URL>
     ```
7. Open the provided link to edit your newly created quiz.

---

## 🛠️ Notes

* Images must be publicly accessible via a direct URL.
* Videos must be **YouTube links**.
* Use `NO` in the CSV where data is not applicable (instead of leaving blank).
* Supported answer shuffling only applies to MCQ/Checkbox types.

---

## 📌 Example Usage

After uploading your CSV and running the script, a Google Form quiz is generated like this:

* **Q1:** What is 2+2? → Multiple Choice with correct answer "4"
* **Q2:** Select prime numbers → Checkbox with correct answers "2" and "3"
* **Q3:** Rate your satisfaction → Scale question (1–5)
* **Q4:** Upload proof of work → Image question
* **Q5:** Watch this tutorial → Embedded YouTube video

---

## ✅ Output

At the end of the script, the Apps Script log will display:

```
✅ Form created: https://docs.google.com/forms/d/xxxxxxxxxxxx/edit
```

Click the link to view/edit your quiz.

```

---

Do you want me to also include a **diagram/flowchart (in Mermaid)** in the README to show the script’s workflow?
```
