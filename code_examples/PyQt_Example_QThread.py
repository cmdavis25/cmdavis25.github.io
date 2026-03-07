import sys
import time
import numpy as np
from sklearn.datasets import load_iris
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score

from PyQt5.QtCore import QObject, QThread, pyqtSignal
from PyQt5.QtWidgets import (
    QApplication, QMainWindow, QWidget, QVBoxLayout,
    QPushButton, QLabel, QProgressBar
)


# ─── Worker ───────────────────────────────────────────────────────────────────

class ModelTrainer(QObject):
    """Trains a RandomForest on the Iris dataset on a background thread."""

    progress = pyqtSignal(int)          # 0–100
    status   = pyqtSignal(str)          # status messages
    result   = pyqtSignal(float)        # final CV accuracy
    error    = pyqtSignal(str)          # any exception message
    finished = pyqtSignal()

    def run(self):
        try:
            self.status.emit("Loading dataset…")
            self.progress.emit(10)
            X, y = load_iris(return_X_y=True)
            time.sleep(0.5)             # simulate I/O latency

            self.status.emit("Building model…")
            self.progress.emit(30)
            model = RandomForestClassifier(n_estimators=200, random_state=42)
            time.sleep(0.5)

            self.status.emit("Running 5-fold cross-validation…")
            self.progress.emit(50)
            scores = cross_val_score(model, X, y, cv=5, scoring="accuracy")
            time.sleep(0.5)

            self.status.emit("Computing statistics…")
            self.progress.emit(85)
            mean_acc = float(np.mean(scores))
            time.sleep(0.3)

            self.progress.emit(100)
            self.result.emit(mean_acc)

        except Exception as e:
            self.error.emit(str(e))

        finally:
            self.finished.emit()


# ─── Main Window ──────────────────────────────────────────────────────────────

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("QThread — Model Trainer")
        self.setMinimumWidth(380)

        # Widgets
        self.status_label   = QLabel("Press 'Train' to start.")
        self.progress_bar   = QProgressBar()
        self.result_label   = QLabel("")
        self.train_button   = QPushButton("Train Model")

        self.progress_bar.setValue(0)

        layout = QVBoxLayout()
        for w in (self.status_label, self.progress_bar,
                  self.result_label, self.train_button):
            layout.addWidget(w)

        container = QWidget()
        container.setLayout(layout)
        self.setCentralWidget(container)

        self.train_button.clicked.connect(self.start_training)

    # ── Thread setup ──────────────────────────────────────────────────────────

    def start_training(self):
        self.train_button.setEnabled(False)
        self.result_label.setText("")
        self.progress_bar.setValue(0)

        self.thread = QThread()
        self.worker = ModelTrainer()
        self.worker.moveToThread(self.thread)

        # Connect worker signals → GUI slots (safe cross-thread updates)
        self.worker.progress.connect(self.progress_bar.setValue)
        self.worker.status.connect(self.status_label.setText)
        self.worker.result.connect(self.show_result)
        self.worker.error.connect(self.show_error)

        # Lifecycle cleanup
        self.thread.started.connect(self.worker.run)
        self.worker.finished.connect(self.thread.quit)
        self.worker.finished.connect(self.worker.deleteLater)
        self.thread.finished.connect(self.thread.deleteLater)
        self.thread.finished.connect(lambda: self.train_button.setEnabled(True))

        self.thread.start()

    # ── Slots (run on GUI thread) ──────────────────────────────────────────────

    def show_result(self, accuracy: float):
        self.result_label.setText(
            f"✅ Cross-validated accuracy: {accuracy:.2%}"
        )
        self.status_label.setText("Training complete.")

    def show_error(self, message: str):
        self.status_label.setText(f"❌ Error: {message}")


# ─── Entry point ──────────────────────────────────────────────────────────────

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec_())