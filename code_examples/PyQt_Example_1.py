import sys
import pandas as pd
from PyQt5.QtWidgets import QApplication, QMainWindow, QWidget, QVBoxLayout, QPushButton, QLabel

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

        layout.addWidget(self.load_btn)
        layout.addWidget(self.info_label)

    def load_csv(self):
        df = pd.read_csv("data.csv")  # hardcoded for now
        self.info_label.setText(f"{len(df):,} rows, {len(df.columns)} columns")

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = CSVInspector()
    window.show()
    sys.exit(app.exec_())