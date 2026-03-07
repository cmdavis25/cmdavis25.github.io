import sys
import pandas as pd
from PyQt5.QtWidgets import QApplication, QMainWindow, QWidget, QVBoxLayout, QPushButton, QLabel, QFileDialog, QTableWidget, QTableWidgetItem

class CSVInspector(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("CSV Inspector")
        self.resize(400, 200)

        central = QWidget()
        self.setCentralWidget(central)
        layout = QVBoxLayout(central)

        self.load_btn = QPushButton("Load CSV")
        self.load_btn.clicked.connect(self.load_csv)

        self.info_label = QLabel("No file loaded.")

        self.table = QTableWidget()  # create the table widget
        self.table.setEditTriggers(QTableWidget.NoEditTriggers)  # read-only

        layout.addWidget(self.load_btn)
        layout.addWidget(self.info_label)
        layout.addWidget(self.table)  # add it to the layout

    def load_csv(self):
        path, _ = QFileDialog.getOpenFileName(self, "Open CSV", "", "CSV Files (*.csv)")
        if not path:
            return
        df = pd.read_csv(path)
        self.info_label.setText(f"{len(df):,} rows, {len(df.columns)} columns")
        self._populate_table(df)  # create the table widget

    def _populate_table(self, df):  # new internal method
        self.table.setRowCount(len(df))
        self.table.setColumnCount(len(df.columns))
        self.table.setHorizontalHeaderLabels(df.columns.tolist())

        for i, row in df.iterrows():
            for j, value in enumerate(row):
                self.table.setItem(i, j, QTableWidgetItem(str(value)))

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = CSVInspector()
    window.show()
    sys.exit(app.exec_())