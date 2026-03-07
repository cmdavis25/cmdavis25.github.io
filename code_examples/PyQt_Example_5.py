import sys
import pandas as pd
from PyQt5.QtWidgets import QApplication, QMainWindow, QWidget, QVBoxLayout, QPushButton, \
    QLabel, QFileDialog, QTableWidget, QTableWidgetItem, QTableView, QComboBox, QSlider, \
    QHBoxLayout
from PyQt5.QtCore import Qt, QAbstractTableModel

def example_function(method, threshold):
        console_message = f"Method: {method} | Threshold: {threshold}"
        return console_message

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

        self.table = QTableView()

        method_row = QHBoxLayout()
        method_row.addWidget(QLabel("Method: "))
        self.method_selector = QComboBox()
        self.method_selector.addItems(["mean", "median", "mode"])
        method_row.addWidget(self.method_selector)

        threshold_row = QHBoxLayout()
        threshold_row.addWidget(QLabel("Threshold: "))
        self.threshold_slider = QSlider(Qt.Horizontal)
        self.threshold_slider.setRange(0, 100)
        self.threshold_slider.setValue(50)
        self.threshold_value_label = QLabel("0.50")  # live readout
        self.threshold_slider.valueChanged.connect(lambda v: self.threshold_value_label.setText(f"{v / 100:.2f}"))
        threshold_row.addWidget(self.threshold_slider)
        threshold_row.addWidget(self.threshold_value_label)

        layout.addWidget(self.load_btn)
        layout.addWidget(self.info_label)
        layout.addWidget(self.table)
        layout.addLayout(method_row)
        layout.addLayout(threshold_row)

    def load_csv(self):
        path, _ = QFileDialog.getOpenFileName(self, "Open CSV", "", "CSV Files (*.csv)")
        if not path:
            return
        df = pd.read_csv(path)
        self.info_label.setText(f"{len(df):,} rows, {len(df.columns)} columns")
        #self._populate_table(df)  # no longer used
        self.table.setModel(DataFrameModel(df))

    def example_method(self):
        method = self.method_selector.currentText()       # "mean", "median", or "mode"
        threshold = self.threshold_slider.value() / 100  # convert back to 0.0–1.0

        return example_function(method=method, threshold=threshold)

class DataFrameModel(QAbstractTableModel):
    def __init__(self, df):
        super().__init__()
        self._df = df

    def rowCount(self, parent=None):
        return len(self._df)

    def columnCount(self, parent=None):
        return len(self._df.columns)

    def data(self, index, role=Qt.DisplayRole):
        if role == Qt.DisplayRole:
            return str(self._df.iloc[index.row(), index.column()])
        return None

    def headerData(self, section, orientation, role=Qt.DisplayRole):
        if role == Qt.DisplayRole:
            if orientation == Qt.Horizontal:
                return self._df.columns[section]
            return str(section)
        return None

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = CSVInspector()
    window.show()
    sys.exit(app.exec_())