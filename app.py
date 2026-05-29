from flask import Flask, render_template,request,jsonify
from flask_mysqldb import MySQL
import re

app=Flask(__name__)

app.config['MYSQL_HOST']='localhost'
app.config['MYSQL_USER']='root'
app.config['MYSQL_PASSWORD']='your_password'
app.config['MYSQL_DB']='community_db'
app.config['MYSQL_CURSORCLASS']='DictCursor'

mysql=MySQL(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/volunteer')
def volunteer():
    return render_template('volunteer.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')


@app.route('/api/contact',methods=['POST'])
def api_contact():
    data=request.get_json()
    name=data.get('name','').strip()
    email=data.get('email','').strip()
    message=data.get('message','').strip()
    
    errors={}

    if not name or len(name)<2:
        errors['name']='Name must be atleast 2 characters'
        
    if not re.match(r'^[^@]+@[^@]+\.[^@]+$', email):
        errors['email']='Please enter a valid email'
        
    if not message or len(message)<10:
        errors['message']='Message must be atleast 10 characters'
        
    
    if errors:
        return jsonify({
            'success':False,
            'errors':errors
        }),400
        
    try:
        cur=mysql.connection.cursor()
        cur.execute(
        """
        INSERT INTO contacts (name,email,message)
        values (%s,%s,%s)
        """,
        (name,email,message)
        )
        mysql.connection.commit()
        cur.close()
        
        return jsonify({
            'success':True,
            'message':'Message sent successfully!'
        })
    except Exception as e:
        return jsonify({
            'success':False,
            'message':str(e)
        }),500
        
@app.route('/api/volunteer',methods=['POST'])
def api_volunteer():
    data=request.get_json()
    name=data.get('name','').strip()
    email=data.get('email','').strip()
    phone=data.get('phone','').strip()
    interest=data.get('interest','').strip()
    bio=data.get('bio','').strip()
    
    errors={}

    if not name or len(name)<2:
        errors['name']='Name must be atleast 2 characters'
        
    if not re.match(r'^[^@]+@[^@]+\.[^@]+$', email):
        errors['email']='Please enter a valid email'
        
    if not bio or len(bio)<10:
        errors['bio']='Bio must be atleast 10 characters'
    
    if not phone:
        errors['phone']='Phone number is required'
        
    if not interest:
        errors['interest']='Please select an area of interest'
        
    
    if errors:
        return jsonify({
            'success':False,
            'errors':errors
        }),400
        
    try:
        cur=mysql.connection.cursor()
        cur.execute(
        """
        INSERT INTO volunteers(name,email,phone,interest,bio)
        values (%s,%s,%s,%s,%s)
        """,
        (name,email,phone,interest,bio)
        )
        mysql.connection.commit()
        cur.close()
        
        return jsonify({
            'success':True,
            'message':'Message sent successfully!'
        })
    except Exception as e:
        return jsonify({
            'success':False,
            'message':str(e)
        }),500
        
@app.route('/api/stats')
def api_stats():
    try:
        cur=mysql.connection.cursor()
        
        cur.execute("SELECT COUNT(*) AS count FROM volunteers")
        volunteers=cur.fetchone()['count']
        
        cur.execute("SELECT COUNT(*) AS count FROM contacts")
        contacts=cur.fetchone()['count']
        
        cur.close()
        
        return jsonify({
            'volunteers':volunteers,
            'messages':contacts,
            'projects':24,
            'years':8
        })
        
    except:
        return jsonify({
            'volunteers':0,
            'messages':0,
            'projects':24,
            'years':8
        })
        
        
if __name__=="__main__":
    app.run(debug=True)