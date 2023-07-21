import tkinter as tk

import MensaKrabbler

def print_monday():
    output_text.delete("1.0", tk.END)
    output_text.insert(tk.END, MensaKrabbler.run(MensaKrabbler.Weekday.MONDAY, ShouldReturnDataFrame=False))

def print_tuesday():
    output_text.delete("1.0", tk.END)
    output_text.insert(tk.END, MensaKrabbler.run(MensaKrabbler.Weekday.TUESDAY, ShouldReturnDataFrame=False))

def print_wednesday():
    output_text.delete("1.0", tk.END)
    output_text.insert(tk.END, MensaKrabbler.run(MensaKrabbler.Weekday.WEDNESDAY, ShouldReturnDataFrame=False))

def print_thursday():
    output_text.delete("1.0", tk.END)
    output_text.insert(tk.END, MensaKrabbler.run(MensaKrabbler.Weekday.THURSDAY, ShouldReturnDataFrame=False))

def print_friday():
    output_text.delete("1.0", tk.END)
    output_text.insert(tk.END, MensaKrabbler.run(MensaKrabbler.Weekday.FRIDAY, ShouldReturnDataFrame=False))

def exit_program():
    root.destroy()

root = tk.Tk()
root.title("Weekdays")

# make the window to fill the screen without going into fullscreen mode
root.geometry("{0}x{1}+0+0".format(root.winfo_screenwidth(), root.winfo_screenheight()))

button_frame = tk.Frame(root)
button_frame.pack()

mon_button = tk.Button(button_frame, text="Mon", command=print_monday)
mon_button.pack(side=tk.LEFT)

tue_button = tk.Button(button_frame, text="Tue", command=print_tuesday)
tue_button.pack(side=tk.LEFT)

wed_button = tk.Button(button_frame, text="Wed", command=print_wednesday)
wed_button.pack(side=tk.LEFT)

thu_button = tk.Button(button_frame, text="Thu", command=print_thursday)
thu_button.pack(side=tk.LEFT)

fri_button = tk.Button(button_frame, text="Fri", command=print_friday)
fri_button.pack(side=tk.LEFT)

output_text = tk.Text(root)
output_text.pack()

# output_text should fit the window and have a light grey background
output_text.config(width=root.winfo_screenwidth(), bg="#f0f0f0")


exit_button = tk.Button(root, text="Exit", command=exit_program)
exit_button.pack()

root.mainloop()